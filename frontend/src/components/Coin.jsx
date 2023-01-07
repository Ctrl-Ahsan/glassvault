import { useContext } from "react"
import styled from "styled-components"
import { AppContext } from "../context/AppContext"
import { IoIosArrowBack } from "react-icons/io"
import {
    ResponsiveContainer,
    LineChart,
    Line,
    YAxis,
    Legend,
    Tooltip,
    XAxis,
} from "recharts"

const Coin = () => {
    const { coin, setPage, setMenuClosed } = useContext(AppContext)
    const data = coin.trades

    const formatNumber = (num) => {
        if (num >= 1000) return parseFloat(num.toFixed(1))
        else if (num >= 10) return parseFloat(num.toFixed(2))
        else return parseFloat(num.toFixed(3))
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp)

        const day = date.getDay() + 1
        const month = date.getMonth() + 1
        const year = date.getFullYear().toString().substring(2, 5)

        return `${day}/${month}/${year}`
    }

    const customTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="tooltip">
                    <div className="label">{`${formatDate(label)}`}</div>
                    <div className="price">Price: ${payload[0].value}</div>
                    <div>Amount: {formatNumber(payload[0].payload.amount)}</div>
                    <div>
                        Value: $
                        {(
                            payload[0].payload.amount * payload[0].payload.price
                        ).toFixed(2)}
                    </div>
                    {payload[1] && (
                        <div className="avg">
                            Avg. Price: ${payload[1].value}
                        </div>
                    )}
                </div>
            )
        }

        return null
    }

    const CoinContainer = styled.section`
        min-height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #1e1e25;
        border: thin solid #3d3c3c;
        border-radius: 5px;
        margin: 2em;
        padding: 2em 1em;

        & .top {
            display: flex;
            justify-content: flex-start;
            margin: 0;
        }

        & .close {
            font-size: 2em;
            transition: all 0.3s;
            position: absolute;
            left: 0.5em;
            :hover {
                color: grey;
                cursor: pointer;
            }
            :active {
                color: grey;
                scale: 0.8;
            }
        }

        & .heading {
            font-family: Roboto Mono;
            font-weight: 700;
            font-size: 2em;
            margin-bottom: 2em;
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
            @media screen and (min-width: 720px) {
                width: 50%;
                max-width: 400px;
            }
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

        & .chart {
            margin: 1em;
            margin-left: 0;
            margin-top: 3em;
            @media screen and (min-width: 720px) {
                width: 50%;
                margin-top: 0em;
            }
        }

        & .tooltip {
            background-color: #121216;
            padding: 1em 2em;
            border-radius: 10px;
            font-weight: 600;
            color: #dfdfdf;
            opacity: 90%;

            & div {
                margin-bottom: 0.5em;
            }
            & .label {
                margin-bottom: 1em;
                font-family: Roboto Mono;
                font-size: 0.8em;
            }
        }

        & .price {
            color: #31ac2b;
        }

        & .avg {
            color: #2b8abe;
        }
    `

    return (
        <CoinContainer className="swing-in-top-fwd">
            <div
                className="close"
                onClick={() => {
                    setMenuClosed(false)
                    setPage("VAULT")
                }}
            >
                <IoIosArrowBack />
            </div>
            <div className="heading">
                <img src={coin.imgURL} alt="logo" />
                {coin.name}
            </div>
            <div className="details">
                <div className="info">
                    <div className="row">
                        <div className="row-heading">Amount</div>
                        <div>{coin.amount}</div>
                    </div>
                    <div className="row">
                        <div className="row-heading">Average Price</div>
                        <div>${coin.avg}</div>
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
                            {coin.price >= coin.avg ? "+" : "-"}
                            {Math.abs(
                                parseFloat(
                                    (
                                        ((coin.price - coin.avg) / coin.avg) *
                                        100
                                    ).toFixed(2)
                                )
                            )}
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
                        <div className="row-heading">P/L</div>
                        <div
                            className={coin.price > coin.avg ? "green" : "red"}
                        >
                            {coin.price >= coin.avg ? "+" : "-"}$
                            {Math.abs(
                                coin.price * coin.amount -
                                    coin.avg * coin.amount
                            ).toFixed(2)}
                        </div>
                    </div>
                </div>
                <div className="chart">
                    <ResponsiveContainer
                        width="100%"
                        height={window.innerWidth > 1800 ? 450 : 350}
                    >
                        <LineChart data={data}>
                            <Line
                                name="Buys"
                                dataKey="price"
                                stroke="#3ede36"
                                strokeWidth={0}
                                dot={{ stroke: "#3ede36", strokeWidth: 3 }}
                                isAnimationActive={false}
                            />
                            {data.length > 1 && (
                                <Line
                                    type="monotone"
                                    name="Avg. Price"
                                    dataKey="cPrice"
                                    stroke="#36b1f4"
                                    strokeWidth={3}
                                    dot={false}
                                />
                            )}
                            <XAxis dataKey="time" hide={true} />
                            <YAxis
                                domain={["auto", "auto"]}
                                width={80}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Legend verticalAlign="bottom" height={1} />
                            <Tooltip
                                content={customTooltip}
                                wrapperStyle={{ outline: "none" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </CoinContainer>
    )
}

export default Coin
