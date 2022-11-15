import { useEffect, useState } from "react"
import styled from "styled-components"
import Asset from "./Asset"
import { BiUserCircle } from "react-icons/bi"
import axios from "axios"

const Vault = () => {
    const [assets, setAssets] = useState([])
    useEffect(() => {
        const setVault = async () => {
            const auth = JSON.parse(localStorage.getItem("auth"))
            const vaultInfo = await axios
                .post("/vault", auth)
                .catch((error) => error.response)
            let assetsArray = Object.entries(vaultInfo.data)
            const coinInfo = await axios.get(
                "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false"
            )
            for (const asset of assetsArray) {
                for (const coin of coinInfo.data) {
                    if (asset[0].toLowerCase() === coin.symbol) {
                        asset[1].img = coin.image
                        break
                    }
                }
                if (asset[1].img === undefined) {
                    const coinInfo2 = await axios.get(
                        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=2&sparkline=false"
                    )
                    for (const coin of coinInfo2.data) {
                        if (asset[0].toLowerCase() === coin.symbol) {
                            asset[1].img = coin.image
                            break
                        }
                    }
                    if (asset[1].img === undefined) {
                        const coinInfo3 = await axios.get(
                            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=3&sparkline=false"
                        )
                        for (const coin of coinInfo3.data) {
                            if (asset[0].toLowerCase() === coin.symbol) {
                                asset[1].img = coin.image
                                break
                            }
                        }
                        if (asset[1].img === undefined)
                            asset[1].img =
                                "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579"
                    }
                }
            }
            setAssets(assetsArray)
        }
        setVault()
    }, [])
    const VaultContainer = styled.section`
        min-height: 100vh;

        & .heading {
            font-size: 3em;
            font-weight: 700;
            display: flex;
            margin: 1em;
            margin-bottom: 1em;
        }

        & .user {
            position: absolute;
            font-size: 4.5em;
            top: 8%;
            right: 5%;
        }

        & .list {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            column-gap: 4vw;
            row-gap: 30px;

            margin: 2em;

            @media screen and (max-width: 2600px) {
                grid-template-columns: 1fr 1fr;
            }

            @media screen and (max-width: 1600px) {
                grid-template-columns: 1fr;
            }
        }
    `
    return (
        <VaultContainer>
            <div className="heading">Vault</div>
            <div className="user">
                <BiUserCircle />
            </div>
            <div className="list">
                {assets !== [] &&
                    assets.map((asset) => {
                        return (
                            <Asset
                                key={asset[0]}
                                name={asset[0]}
                                amount={asset[1].held}
                                avg={asset[1].avgBuy}
                                imgURL={asset[1].img}
                            />
                        )
                    })}
            </div>
        </VaultContainer>
    )
}

export default Vault
