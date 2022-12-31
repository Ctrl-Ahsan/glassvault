const express = require("express")
const fetch = require("node-fetch")
const crypto = require("crypto")
const CryptoJS = require("crypto-js")
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "../.env") })
const port = process.env.PORT || 8000

// express setup
const app = express()
app.enable("trust proxy")
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// declare variables and set base URL
const burl = "https://api.binance.com"
let timestamp
let params
let signature
let url

// login
app.post("/login", async (req, res) => {
    let response = {}

    // get API key and secret from request
    const { key, secret } = req.body
    if (!key || !secret) {
        res.status(400).send("Please fill in all fields")
        return
    }

    // signed request for API Key Permissions (serves as authentication)
    timestamp = Date.now()
    params = `timestamp=${timestamp}`
    signature = crypto.createHmac("sha256", secret).update(params).digest("hex")
    url = `${burl}/sapi/v1/account/apiRestrictions?${params}&signature=${signature}`

    // make request and store response
    const loginResponse = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-MBX-APIKEY": key,
        },
    })
    const responseBody = await loginResponse.json()

    // check if credentials are valid and read-only
    if (responseBody.code === -2008) {
        res.status(401).send("Invalid API Key")
    } else if (responseBody.code === -1022) {
        res.status(401).send("Invalid Secret")
    } else if (!responseBody.enableReading) {
        res.status(403).send("API does not have reading enabled")
    } else if (
        responseBody.enableMargin ||
        responseBody.enableSpotAndMarginTrading ||
        responseBody.enableWithdrawals ||
        responseBody.enableInternalTransfer ||
        responseBody.enableFutures ||
        responseBody.permitsUniversalTransfer ||
        responseBody.enableVanillaOptions
    ) {
        res.status(400).send("API is not read-only")
    } else {
        // encrpyt key and secret to send back in response
        response = {
            encKey: CryptoJS.AES.encrypt(
                key,
                process.env.AUTH_SECRET
            ).toString(),
            encSecret: CryptoJS.AES.encrypt(
                secret,
                process.env.AUTH_SECRET
            ).toString(),
        }
        res.json(response)
    }
})

// vault
app.post("/vault", async (req, res) => {
    let response = {}
    let trades = []

    // get API key and secret from request
    let { key, secret } = req.body
    if (!key || !secret) {
        res.status(400).send("Request missing API Key or Secret")
        return
    }

    // decrypt key and secret
    key = CryptoJS.AES.decrypt(key, process.env.AUTH_SECRET).toString(
        CryptoJS.enc.Utf8
    )
    secret = CryptoJS.AES.decrypt(secret, process.env.AUTH_SECRET).toString(
        CryptoJS.enc.Utf8
    )

    // signed request for Account Snapshot
    timestamp = Date.now()
    params = `type=SPOT&timestamp=${timestamp}`
    signature = crypto.createHmac("sha256", secret).update(params).digest("hex")
    url = `${burl}/sapi/v1/accountSnapshot?${params}&signature=${signature}`

    // get account snapshot, then fetch trades, then calculate average buy
    fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-MBX-APIKEY": key,
        },
    })
        .then((res) => res.json())
        .then((json) => fetchTrades(json))
        .then(() => calcAvgBuy(trades))
        .then(() => res.json(response))
        .catch((error) => {
            res.status(400).send("Could not fetch trades")
            console.error(error)
        })

    const formatNumber = (num) => {
        if (num >= 1000) return parseFloat(num.toFixed(1))
        else if (num >= 10) return parseFloat(num.toFixed(2))
        else if (num >= 1) return parseFloat(num.toFixed(3))
        else return parseFloat(num.toFixed(4))
    }

    // fetch trades for non-zero balances
    const fetchTrades = async (json) => {
        const data = json.snapshotVos[json.snapshotVos.length - 2].data.balances
        for (let i = 0; i < data.length; i++) {
            // find non-zero balances
            if (
                (parseFloat(data[i].free) > 0 ||
                    parseFloat(data[i].locked) > 0) &&
                data[i].asset != "USDT" &&
                data[i].asset != "BUSD"
            ) {
                response[`${data[i].asset}`] = {
                    amount: formatNumber(
                        parseFloat(data[i].free) + parseFloat(data[i].locked)
                    ),
                }

                // signed request for Accout Trade List (USDT pairs)
                timestamp = Date.now()
                params = `symbol=${data[i].asset}USDT&limit=1000&timestamp=${timestamp}`
                signature = crypto
                    .createHmac("sha256", secret)
                    .update(params)
                    .digest("hex")
                url = `${burl}/api/v3/myTrades?${params}&signature=${signature}`

                let coinTrades = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-MBX-APIKEY": key,
                    },
                }).then((res) => res.json())

                // signed request for Accout Trade List (BUSD pairs)
                timestamp = Date.now()
                params = `symbol=${data[i].asset}BUSD&limit=1000&timestamp=${timestamp}`
                signature = crypto
                    .createHmac("sha256", secret)
                    .update(params)
                    .digest("hex")
                url = `${burl}/api/v3/myTrades?${params}&signature=${signature}`

                let coinTrades2 = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-MBX-APIKEY": key,
                    },
                }).then((res) => res.json())

                // check if coin has been traded in both USDT and BUSD
                if (coinTrades.length > 0 && coinTrades2.length > 0) {
                    coinTrades = coinTrades.concat(coinTrades2)
                    coinTrades.sort((a, b) => {
                        return a.time - b.time
                    })
                }
                // check if coin has been traded
                if (coinTrades.length > 0) trades.push(coinTrades)
            }
        }
    }

    // calculate average buy price
    const calcAvgBuy = (tradesArray) => {
        // for all assets in trades array
        for (const trades of tradesArray) {
            let amount = response[`${trades[0].symbol.slice(0, -4)}`].amount
            let invested = 0
            let recentTrades = []

            // calculate the purchase value for held amount
            let tempCount = amount
            let i = trades.length - 1

            while (tempCount > 0 && i >= 0) {
                if (trades[i].isBuyer) {
                    if (parseFloat(trades[i].qty) <= tempCount) {
                        tempCount -= parseFloat(trades[i].qty)
                        invested += parseFloat(trades[i].quoteQty)
                    } else if (parseFloat(trades[i].qty) > tempCount) {
                        invested +=
                            (tempCount / parseFloat(trades[i].qty)) *
                            parseFloat(trades[i].quoteQty)
                        tempCount = 0
                    }
                }
                i--
            }

            // collect recent trades
            tempCount = amount
            i = trades.length - 1

            while (tempCount > 0 && i >= 0) {
                if (trades[i].isBuyer) {
                    if (parseFloat(trades[i].qty) <= tempCount) {
                        tempCount -= parseFloat(trades[i].qty)
                        recentTrades.push({
                            orderId: trades[i].orderId,
                            time: trades[i].time,
                            price: parseFloat(trades[i].price),
                            amount: parseFloat(trades[i].qty),
                        })
                    } else if (parseFloat(trades[i].qty) > tempCount) {
                        recentTrades.push({
                            orderId: trades[i].orderId,
                            time: trades[i].time,
                            price: parseFloat(trades[i].price),
                            amount: parseFloat(trades[i].qty),
                        })
                        tempCount = 0
                    }
                }
                i--
            }

            // prep recent trades array
            recentTrades.reverse()
            for (let i = 0; i < recentTrades.length; i++) {
                if (i !== recentTrades.length - 1) {
                    // merge trades with same orderId
                    if (
                        recentTrades[i].orderId ===
                            recentTrades[i + 1].orderId &&
                        recentTrades[i].price === recentTrades[i + 1].price
                    ) {
                        recentTrades[i].amount += recentTrades[i + 1].amount
                        recentTrades[i].time = recentTrades[i + 1].time
                        recentTrades.splice(i + 1, 1)
                        i--
                    }
                }
            }

            // calculate and assign cumulative amount/average price
            let cAmount = 0
            let cPrice = 0
            for (let i = 0; i < recentTrades.length; i++) {
                cPrice =
                    (cPrice * cAmount +
                        recentTrades[i].price * recentTrades[i].amount) /
                    (cAmount + recentTrades[i].amount)
                cAmount += recentTrades[i].amount
                recentTrades[i].cAmount = formatNumber(cAmount)
                recentTrades[i].cPrice = formatNumber(cPrice)
            }

            response[`${trades[0].symbol}`.slice(0, -4)] = {
                ...response[`${trades[0].symbol}`.slice(0, -4)],
                invested: formatNumber(invested),
                avgBuy: formatNumber(invested / amount),
                trades: recentTrades,
            }
        }
    }
})

// summary
app.post("/summary", async (req, res) => {
    let response = {}

    // get API key and secret from request
    let { key, secret, timespan } = req.body
    if (!key || !secret || !timespan) {
        res.status(400).send("Request missing API Key, Secret or timespan")
        return
    }

    // decrypt key and secret
    key = CryptoJS.AES.decrypt(key, process.env.AUTH_SECRET).toString(
        CryptoJS.enc.Utf8
    )
    secret = CryptoJS.AES.decrypt(secret, process.env.AUTH_SECRET).toString(
        CryptoJS.enc.Utf8
    )

    // declare and set time variables / constants
    let beginTime
    let endTime
    const foundingTime = 1498867200000
    const oneMonth = 2592000000
    const threeMonths = 7889400000
    const oneYear = 31556952000
    const currentTime = Date.now()

    // set timespan beginning
    switch (timespan) {
        case "1":
            timespan = oneMonth
            break
        case "3":
            timespan = threeMonths
            break
        case "12":
            timespan = oneYear
            break
        case "all":
            timespan = currentTime - foundingTime
            break
        default:
            timespan = currentTime - foundingTime
            break
    }
    beginTime = currentTime - timespan

    // FIAT buy history
    let fiatHistory = []
    while (beginTime < currentTime) {
        // set timespan end
        if (beginTime + threeMonths <= currentTime) {
            endTime = beginTime + threeMonths
        } else {
            endTime = currentTime
        }

        // signed request for FIAT Payment History
        timestamp = Date.now()
        params = `transactionType=0&beginTime=${beginTime}&endTime=${endTime}&timestamp=${timestamp}`
        signature = crypto
            .createHmac("sha256", secret)
            .update(params)
            .digest("hex")
        url = `${burl}/sapi/v1/fiat/payments?${params}&signature=${signature}`

        fiatResponse = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "X-MBX-APIKEY": key,
            },
        }).then((res) => res.json())

        // push completed FIAT payment
        if (fiatResponse.data && fiatResponse.total > 0) {
            for (entry of fiatResponse.data) {
                if ((entry.status = "Completed")) fiatHistory.push(entry)
            }
        }

        // increment
        beginTime += threeMonths
    }

    // calculate FIAT invested and purchase fees
    let fiatInvested = {}
    let purchaseFees = {}
    for (entry of fiatHistory) {
        fiatInvested[`${entry.fiatCurrency}`]
            ? (fiatInvested[`${entry.fiatCurrency}`] += parseFloat(
                  entry.sourceAmount
              ))
            : (fiatInvested[`${entry.fiatCurrency}`] = parseFloat(
                  entry.sourceAmount
              ))
        purchaseFees[`${entry.fiatCurrency}`]
            ? (purchaseFees[`${entry.fiatCurrency}`] += parseFloat(
                  entry.totalFee
              ))
            : (purchaseFees[`${entry.fiatCurrency}`] = parseFloat(
                  entry.totalFee
              ))
    }
    fiatInvested = Object.entries(fiatInvested)
    purchaseFees = Object.entries(purchaseFees)

    // All trade history
    let trades = []

    // signed request for Account Snapshot
    timestamp = Date.now()
    params = `type=SPOT&timestamp=${timestamp}`
    signature = crypto.createHmac("sha256", secret).update(params).digest("hex")
    url = `${burl}/sapi/v1/accountSnapshot?${params}&signature=${signature}`

    const accountSnapshot = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-MBX-APIKEY": key,
        },
    }).then((res) => res.json())

    const allCoins =
        accountSnapshot.snapshotVos[accountSnapshot.snapshotVos.length - 2].data
            .balances

    const fiatCurrencies = [
        "USDT",
        "BUSD",
        "UST",
        "USDC",
        "DAI",
        "FRAX",
        "TUSD",
        "USDD",
        "GUSD",
        "USDN",
        "USTC",
        "MXN",
        "UGX",
        "SDG",
        "XOF",
        "SEK",
        "QAR",
        "LYD",
        "KWD",
        "CHF",
        "HRK",
        "VND",
        "TJS",
        "AED",
        "DKK",
        "BGN",
        "BHD",
        "KZT",
        "AFN",
        "HUF",
        "PEN",
        "TMT",
        "CLP",
        "TND",
        "DOP",
        "PHP",
        "COP",
        "USD",
        "ETB",
        "LAK",
        "BND",
        "AMD",
        "TRY",
        "EUR",
        "RON",
        "NGN",
        "PKR",
        "PLN",
        "BRL",
        "ZAR",
        "TWD",
        "UYU",
        "OMR",
        "KES",
        "ARS",
        "UZS",
        "RUB",
        "DZD",
        "KGS",
        "XAF",
        "TZS",
        "AUD",
        "KHR",
        "IDR",
        "MMK",
        "NOK",
        "CZK",
        "MNT",
        "GBP",
        "BYN",
        "GEL",
        "UAH",
        "GHS",
        "JOD",
        "HKD",
        "CAD",
        "SAR",
        "INR",
        "JPY",
        "EGP",
        "NZD",
    ]

    let purchased = 0
    let sold = 0
    let fees = 0

    for (entry of allCoins) {
        // filters out fiat currencies
        if (!fiatCurrencies.includes(entry.asset)) {
            // signed request for Accout Trade List (USDT pairs)
            timestamp = Date.now()
            params = `symbol=${entry.asset}USDT&limit=1000&timestamp=${timestamp}`
            signature = crypto
                .createHmac("sha256", secret)
                .update(params)
                .digest("hex")
            url = `${burl}/api/v3/myTrades?${params}&signature=${signature}`

            let coinTrades = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "X-MBX-APIKEY": key,
                },
            }).then((res) => res.json())

            // signed request for Accout Trade List (BUSD pairs)
            timestamp = Date.now()
            params = `symbol=${entry.asset}BUSD&limit=1000&timestamp=${timestamp}`
            signature = crypto
                .createHmac("sha256", secret)
                .update(params)
                .digest("hex")
            url = `${burl}/api/v3/myTrades?${params}&signature=${signature}`

            let coinTrades2 = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "X-MBX-APIKEY": key,
                },
            }).then((res) => res.json())

            // merge trades if coin has been traded in both USDT and BUSD
            if (coinTrades.length > 0 && coinTrades2.length > 0) {
                coinTrades = coinTrades.concat(coinTrades2)
                coinTrades.sort((a, b) => {
                    return a.time - b.time
                })
            }

            // check if coin has been traded
            if (coinTrades.length > 0) trades.push(coinTrades)
            else if (coinTrades2.length > 0) trades.push(coinTrades2)
        }
    }

    // calculate trading volume and fees
    for (coin of trades) {
        for (trade of coin) {
            if (trade.isBuyer) {
                purchased += parseFloat(trade.quoteQty)
                if (trade.commissionAsset === "BNB") {
                    fees += parseFloat(trade.quoteQty) * 0.00075
                } else {
                    fees += parseFloat(trade.quoteQty) * 0.001
                }
            } else {
                sold += parseFloat(trade.quoteQty)
                if (trade.commissionAsset === "BNB") {
                    fees += parseFloat(trade.quoteQty) * 0.00075
                } else {
                    fees += parseFloat(trade.quoteQty) * 0.001
                }
            }
        }
    }

    response = {
        fiatInvested: fiatInvested,
        purchaseFees: purchaseFees,
        purchased: purchased,
        sold: sold,
        fees: fees,
    }
    res.json(response)
})

app.listen(port, () => console.log("Server started on port " + port))
