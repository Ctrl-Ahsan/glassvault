const express = require("express")
const fetch = require("node-fetch")
const crypto = require("crypto")
const CryptoJS = require("crypto-js")
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "../.env") })
const port = process.env.PORT || 8000

const app = express()

app.enable("trust proxy")
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const burl = "https://api.binance.com"
let timestamp
let params
let signature
let url
let trades = []
let response = {}

app.post("/login", async (req, res) => {
    const { key, secret } = req.body
    if (!key || !secret) {
        res.status(400).send("Please fill in all fields")
        return
    }

    // (Authentication) signed request for account permissions
    timestamp = Date.now()
    params = `timestamp=${timestamp}`
    signature = crypto.createHmac("sha256", secret).update(params).digest("hex")
    url = `${burl}/sapi/v1/account/apiRestrictions?${params}&signature=${signature}`

    const loginResponse = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-MBX-APIKEY": key,
        },
    })

    const responseBody = await loginResponse.json()

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

app.post("/vault", async (req, res) => {
    let { key, secret } = req.body
    if (!key || !secret) {
        res.status(400).send("Please fill in all fields")
        return
    }

    // decrypt key and secret
    key = CryptoJS.AES.decrypt(key, process.env.AUTH_SECRET).toString(
        CryptoJS.enc.Utf8
    )
    secret = CryptoJS.AES.decrypt(secret, process.env.AUTH_SECRET).toString(
        CryptoJS.enc.Utf8
    )

    const fetchTrades = async (json) => {
        // Fetch trade information for non-zero balances
        const data = json.snapshotVos[json.snapshotVos.length - 1].data.balances
        for (let i = 0; i < data.length; i++) {
            if (
                (parseFloat(data[i].free) > 0 ||
                    parseFloat(data[i].locked) > 0) &&
                data[i].asset != "USDT" &&
                data[i].asset != "BUSD"
            ) {
                response[`${data[i].asset}`] = {
                    held: parseFloat(data[i].free) + parseFloat(data[i].locked),
                }

                // signed request for USDT pairs
                timestamp = Date.now()
                params = `symbol=${data[i].asset}USDT&timestamp=${timestamp}`
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

                // signed request for BUSD pairs
                timestamp = Date.now()
                params = `symbol=${data[i].asset}BUSD&timestamp=${timestamp}`
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
                        return a[time] - b[time]
                    })
                }
                // check if coin has been traded
                if (coinTrades.length > 0) trades.push(coinTrades)
            }
        }
    }

    const calcAvgBuy = (tradesArray) => {
        for (const trades of tradesArray) {
            let held = 0
            let fee = 0
            let invested = 0
            for (const trade of trades) {
                if (trade.isBuyer) held += parseFloat(trade.qty)
                else held -= parseFloat(trade.qty)

                if (trade.isBuyer && trade.commissionAsset !== "BNB")
                    fee += parseFloat(trade.commission)
            }

            if (held > 0) {
                let tempCount = held
                let i = trades.length - 1
                while (tempCount > 0 && i >= 0) {
                    if (trades[i].isBuyer) {
                        if (parseFloat(trades[i].qty) < tempCount) {
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
            }
            response[`${trades[0].symbol}`.slice(0, -4)] = {
                ...response[`${trades[0].symbol}`.slice(0, -4)],
                purchased: held - fee,
                invested: invested,
                avgBuy: invested / (held - fee),
            }
        }
    }

    // signed request for account snapshot
    timestamp = Date.now()
    params = `type=SPOT&timestamp=${timestamp}`
    signature = crypto.createHmac("sha256", secret).update(params).digest("hex")
    url = `${burl}/sapi/v1/accountSnapshot?${params}&signature=${signature}`

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
        .catch(() => res.status(401).send("Could not fetch trades"))
})

app.listen(port, () => console.log("Server started on port " + port))
