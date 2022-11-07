const fetch = require("node-fetch")
const express = require("express")
const crypto = require("crypto")
const port = process.env.PORT || 8000

const app = express()

app.enable("trust proxy")
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const burl = "https://api.binance.com"

app.post("/login", async (req, res) => {
    const { key, secret } = req.body

    if (!key || !secret) {
        res.status(400).send("Please fill in all fields")
        return
    }

    let timestamp
    let params
    let signature
    let url
    let trades = []

    const fetchTrades = async (json) => {
        // Fetch trade information for all traded symbols
        const data = json.snapshotVos[json.snapshotVos.length - 1].data.balances
        for (let i = 0; i < data.length; i++) {
            if (
                parseInt(data[i].free) > 0 &&
                data[i].asset != "USDT" &&
                data[i].asset != "BUSD"
            ) {
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

                if (coinTrades.length > 0 && coinTrades2.length > 0) {
                    coinTrades = coinTrades.concat(coinTrades2)
                    coinTrades.sort((a, b) => {
                        return a[time] - b[time]
                    })
                }
                if (coinTrades.length > 0) trades.push(coinTrades)
            }
        }
    }

    // signed request for account snapshot (authentication)
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
        .then(() => res.json(trades))
        .catch(() => res.json("Authentication failed"))
})

app.listen(port, () => console.log("Server started on port " + port))
