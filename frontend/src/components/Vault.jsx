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
            setAssets(Object.entries(vaultInfo.data))
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
                    assets.map((asset, i) => {
                        return (
                            <Asset
                                key={i}
                                name={asset[0]}
                                amount={asset[1].held}
                                avg={asset[1].avgBuy}
                                imgURL="https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579"
                            />
                        )
                    })}
                {/* <Asset
                    name="Bitcoin"
                    amount="0.047"
                    avg="23,539.32"
                    imgURL="https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579"
                />
                <Asset
                    name="Ethereum"
                    amount="1.219"
                    avg="2,411.67"
                    imgURL="https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880"
                />
                <Asset
                    name="Binance Coin"
                    amount="43.931"
                    avg="331.48"
                    imgURL="https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850"
                />
                <Asset
                    name="Cardano"
                    amount="773.430"
                    avg="1.576"
                    imgURL="https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860"
                />
                <Asset
                    name="Ripple"
                    amount="1137.286"
                    avg="0.454"
                    imgURL="https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1605778731"
                /> */}
            </div>
        </VaultContainer>
    )
}

export default Vault
