import { useContext } from "react"
import styled from "styled-components"
import { AppContext } from "../context/AppContext"
import { IoIosClose } from "react-icons/io"

const Coin = () => {
    const { coin, setPage } = useContext(AppContext)

    const formatNumber = (num) => {
        if (num >= 1000) return num.toFixed()
        else if (num >= 10) return num.toFixed(2)
        else return num.toFixed(3)
    }

    const CoinContainer = styled.section`
        min-height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #1e1e25;
        border: thin solid #3d3c3c;
        border-radius: 5px;
        margin: 2em;
        padding-bottom: 2em;

        & .top {
            display: flex;
            justify-content: flex-end;
            margin: 0;
        }

        & .close {
            font-size: 2.5em;
            transition: all 0.3s;
            margin-top: 0.1em;
            margin-right: 0.1em;

            :hover {
                color: grey;
                cursor: pointer;
            }
            :active {
                color: grey;
                font-size: 1.8em;
            }
        }

        & .heading {
            font-family: Roboto Mono;
            font-weight: 700;
            font-size: 2em;
            margin-bottom: 1em;
            display: flex;
            justify-content: center;

            & img {
                width: 1em;
                margin: 10px;
            }
        }

        & .details {
            display: flex;
            @media screen and (max-width: 720px) {
                flex-direction: column;
            }
            justify-content: space-evenly;
        }

        & .info {
        }

        & .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            margin-bottom: 1em;
        }

        & .row-heading {
            color: #aeaeae;
            font-weight: 700;
        }

        & .green {
            color: green;
        }
        & .red {
            color: red;
        }
    `
    return (
        <CoinContainer>
            <div className="top">
                <div className="close" onClick={() => setPage("VAULT")}>
                    <IoIosClose />
                </div>
            </div>
            <div className="heading">
                <img src={coin.imgURL} alt="logo" />
                {coin.name}
            </div>
            <div className="details">
                <div className="chart">Chart</div>
                <div className="info">
                    <div className="row">
                        <div className="row-heading">Amount</div>
                        <div>{formatNumber(coin.amount)}</div>
                    </div>
                    <div className="row">
                        <div className="row-heading">Average Price</div>
                        <div>${formatNumber(coin.avg)}</div>
                    </div>
                    <div className="row">
                        <div className="row-heading">Current Price</div>
                        <div>${formatNumber(coin.price)}</div>
                    </div>
                    <div className="row">
                        <div className="row-heading">P/L</div>
                        <div
                            className={coin.price > coin.avg ? "green" : "red"}
                        >
                            {(
                                ((coin.price - coin.avg) / coin.avg) *
                                100
                            ).toFixed(2)}
                            %
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="row-heading">Purchase Value</div>
                        <div>${(coin.avg * coin.amount).toFixed(2)}</div>
                    </div>
                    <div className="row">
                        <div className="row-heading">Current Value</div>
                        <div>${(coin.price * coin.amount).toFixed(2)}</div>
                    </div>
                    <div className="row">
                        <div className="row-heading">Absolute P/L</div>
                        <div
                            className={coin.price > coin.avg ? "green" : "red"}
                        >
                            {coin.price - coin.avg ? "-" : ""}$
                            {Math.abs(
                                coin.price * coin.amount -
                                    coin.avg * coin.amount
                            ).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        </CoinContainer>
    )
}

export default Coin
