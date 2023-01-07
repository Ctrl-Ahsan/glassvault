import { useState, useContext } from "react"
import styled from "styled-components"
import axios from "axios"
import { toast } from "react-toastify"
import { IoClose } from "react-icons/io5"
import { IoIosArrowBack } from "react-icons/io"
import { AppContext } from "../context/AppContext"
import Spinner from "./Spinner"

const Summary = () => {
    const {
        stats,
        setStats,
        setPage,
        setMenuOpened,
        setMenuClosed,
        summaryOpened,
    } = useContext(AppContext)
    const [loading, setLoading] = useState(false)

    const syncStats = async () => {
        try {
            setLoading(true)

            const auth = JSON.parse(localStorage.getItem("auth"))
            const response = await axios
                .post("/stats", auth)
                .catch((error) => error.response)

            if (response.status !== 200) {
                toast.error(response.data)
                setLoading(false)
            } else {
                setStats(response.data)
                setLoading(false)
            }
        } catch (error) {
            toast.error("Could not sync data")
        }
    }

    const relativeTime = (timestamp) => {
        const currentTime = Date.now()
        const timePassed = currentTime - timestamp

        if (timePassed >= 172800000)
            return `${parseInt(timePassed / 86400000)} days ago`
        else if (timePassed >= 86400000) return "1 day ago"
        else if (timePassed >= 7200000)
            return `${parseInt(timePassed / 3600000)} hours ago`
        else if (timePassed >= 3600000) return "1 hour ago"
        else if (timePassed > 120000)
            return `${parseInt(timePassed / 60000)} minutes ago`
        else return "a few moments ago"
    }

    const SummaryContainer = styled.section`
        position: absolute;
        z-index: 1;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 80%;
        max-width: 800px;

        background: rgba(0, 0, 0, 0.4);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(148, 148, 148, 0.3);

        & .nav {
            position: absolute;
            top: 2em;
            display: flex;
            justify-content: space-between;
            width: 90%;
        }

        & .close {
            font-size: 2em;
            cursor: pointer;
            transition: all 0.3s;

            :hover {
                color: grey;
            }
            :active {
                color: grey;
                scale: 0.9;
            }
        }

        & .back {
            font-size: 2em;
            cursor: pointer;
            transition: all 0.3s;

            :hover {
                color: grey;
            }
            :active {
                color: grey;
                scale: 0.9;
            }
        }

        & .summary {
            margin: 5em;
            margin-top: 6em;
            margin-bottom: 1em;
            width: 70%;
        }

        & .stats {
            display: flex;
            flex-direction: column;
            margin-bottom: 1em;
        }

        & .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }

        & .row-title {
            font-size: 1.4em;
            font-weight: 700;
            padding: 1em;
            border: 1.2px solid rgb(0, 0, 0);
            border-radius: 10px 10px 0px 0px;
            background-color: #60339c;
        }

        & .row-heading {
            font-weight: 700;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1em;
            border: 1.2px solid rgb(0, 0, 0);
            background-color: #565656;
        }

        & .row-value {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 1em;
            border: 1.2px solid rgb(0, 0, 0);
            background-color: #565656;
        }

        & #bottom-left {
            border-radius: 0px 0px 0px 10px;
        }
        & #bottom-right {
            border-radius: 0px 0px 10px 0px;
        }

        & .green {
            color: #3cff3c;
        }
        & .red {
            color: #ff3d3d;
        }

        & button {
            cursor: pointer;
            background-color: green;
            padding: 0.5em 0.7em;
            border: none;
            border-radius: 360px;

            font: inherit;
            font-size: 1.1em;
            font-weight: 700;
            color: inherit;

            transition: all 0.3s;
            :hover {
                background-color: #016d02;
            }
            :active {
                scale: 0.95;
            }
        }

        & .sync-text {
            margin-top: 0.5em;

            color: grey;
            font-weight: 300;
            font-size: 0.7em;
        }
    `
    return (
        <SummaryContainer className={summaryOpened ? "fade-in" : ""}>
            <div className="nav">
                <div className="back" onClick={() => setLoading(!loading)}>
                    <IoIosArrowBack />
                </div>
                <div
                    className="close"
                    onClick={() => {
                        setMenuOpened(false)
                        setMenuClosed(true)
                        setLoading(null)
                        setPage("VAULT")
                    }}
                >
                    <IoClose />
                </div>
            </div>
            <div className="summary">
                <div className="stats">
                    <div className="row-title">Summary</div>
                    <div className="row">
                        <div className="row-heading">FIAT Invested</div>
                        <div className="row-value">
                            {stats.fiatInvested &&
                                stats.fiatInvested.map((entry) => (
                                    <div>
                                        {entry[1].toLocaleString("en-US", {
                                            style: "decimal",
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{" "}
                                        {entry[0]}
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="row">
                        <div className="row-heading">Purchase Fees</div>
                        <div className="row-value">
                            {stats.purchaseFees &&
                                stats.purchaseFees.map((entry) => (
                                    <div>
                                        {entry[1].toLocaleString("en-US", {
                                            style: "decimal",
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{" "}
                                        {entry[0]}
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="row">
                        <div className="row-heading">Buy Volume</div>
                        <div className="row-value">
                            {stats.purchased &&
                                `$${stats.purchased.toLocaleString("en-US", {
                                    style: "decimal",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}`}
                        </div>
                    </div>
                    <div className="row">
                        <div className="row-heading">Sell Volume</div>
                        <div className="row-value">
                            {stats.sold &&
                                `$${stats.sold.toLocaleString("en-US", {
                                    style: "decimal",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}`}
                        </div>
                    </div>
                    <div className="row">
                        <div className="row-heading">Trading Fees</div>
                        <div className="row-value">
                            {stats.fees &&
                                `$${stats.fees.toLocaleString("en-US", {
                                    style: "decimal",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}`}
                        </div>
                    </div>
                    <div className="row">
                        <div className="row-heading" id="bottom-left">
                            P/L
                        </div>
                        <div
                            className={
                                stats.sold > stats.purchased
                                    ? "green row-value"
                                    : stats.sold < stats.purchased
                                    ? "red row-value"
                                    : "row-value"
                            }
                            id="bottom-right"
                        >
                            {stats.purchased &&
                                `${
                                    stats.sold >= stats.purchased ? "+" : "-"
                                }$${Math.abs(
                                    stats.sold - stats.purchased
                                ).toLocaleString("en-US", {
                                    style: "decimal",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}`}
                        </div>
                    </div>
                </div>
                {loading ? (
                    <>
                        <Spinner />
                        <div className="sync-text">Syncing</div>
                    </>
                ) : (
                    <>
                        <button onClick={syncStats}>Sync</button>

                        <div className="sync-text">
                            Last Updated{" "}
                            {stats.updated
                                ? relativeTime(stats.updated)
                                : "N/A"}
                        </div>
                    </>
                )}
            </div>
        </SummaryContainer>
    )
}

export default Summary
