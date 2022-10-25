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
        const data = json.snapshotVos[0].data.balances
        for (let i = 0; i < data.length; i++) {
            // signed request
            timestamp = Date.now()
            params = `symbol=${data[i].asset}USDT&timestamp=${timestamp}`
            signature = crypto
                .createHmac("sha256", secret)
                .update(params)
                .digest("hex")
            url = `${burl}/api/v3/myTrades?${params}&signature=${signature}`

            let trade = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "X-MBX-APIKEY": key,
                },
            }).then((res) => res.json())
            trades.push(trade)
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
        .then(() => res.json(trades))
})

app.listen(port, () => console.log("Server started on port " + port))
