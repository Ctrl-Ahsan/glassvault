import { useEffect, useState } from "react"
import styled from "styled-components"
import Asset from "./Asset"
import { BiUserCircle } from "react-icons/bi"
import axios from "axios"
import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import Coin from "./Coin"

const Vault = () => {
    const { page, setPage } = useContext(AppContext)
    const [assets, setAssets] = useState([])

    useEffect(() => {
        const setVault = async () => {
            // check authentication
            const auth = JSON.parse(localStorage.getItem("auth"))
            // get vault
            const vaultInfo = await axios
                .post("/vault", auth)
                .catch((error) => error.response)
            let assetsArray = Object.entries(vaultInfo.data)
            // get logos
            const coinInfo = await axios.get(
                "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false"
            )
            for (const asset of assetsArray) {
                for (const coin of coinInfo.data) {
                    if (asset[0].toLowerCase() === coin.symbol) {
                        asset[1].name = coin.name
                        asset[1].img = coin.image
                        asset[1].price = coin.current_price
                        break
                    }
                }
                if (asset[1].img === undefined) {
                    const coinInfo2 = await axios.get(
                        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=2&sparkline=false"
                    )
                    for (const coin of coinInfo2.data) {
                        if (asset[0].toLowerCase() === coin.symbol) {
                            asset[1].name = coin.name
                            asset[1].img = coin.image
                            asset[1].price = coin.current_price
                            break
                        }
                    }
                    if (asset[1].img === undefined) {
                        const coinInfo3 = await axios.get(
                            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=3&sparkline=false"
                        )
                        for (const coin of coinInfo3.data) {
                            if (asset[0].toLowerCase() === coin.symbol) {
                                asset[1].name = coin.name
                                asset[1].img = coin.image
                                asset[1].price = coin.current_price
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

        & .top {
            display: flex;
            justify-content: space-between;
            margin: 3em;
            margin-bottom: 2em;
        }
        & .heading {
            font-size: 3em;
            font-weight: 700;
        }

        & .user {
            font-size: 3.5em;
            cursor: pointer;
            transition: all 0.3s;
            :active {
                scale: 0.9;
            }
        }

        & .list {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            column-gap: 4vw;
            row-gap: 30px;

            margin: 2em;

            @media screen and (max-width: 1800px) {
                grid-template-columns: 1fr 1fr;
            }

            @media screen and (max-width: 950px) {
                grid-template-columns: 1fr;
            }
        }
    `
    return (
        <VaultContainer>
            <div className="top">
                <div className="heading">Vault</div>
                <div className="user" onClick={() => setPage("STATS")}>
                    <BiUserCircle />
                </div>
            </div>
            {page === "COIN" ? (
                <Coin />
            ) : (
                <div className="list">
                    {assets !== [] &&
                        assets.map((asset) => {
                            return (
                                <Asset
                                    key={asset[0]}
                                    symbol={asset[0]}
                                    name={asset[1].name}
                                    amount={asset[1].amount}
                                    avg={asset[1].avgBuy}
                                    price={asset[1].price}
                                    trades={asset[1].trades}
                                    imgURL={asset[1].img}
                                />
                            )
                        })}
                </div>
            )}
        </VaultContainer>
    )
}

export default Vault
