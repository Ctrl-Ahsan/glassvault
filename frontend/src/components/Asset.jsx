import { useContext } from "react"
import styled from "styled-components"
import { AppContext } from "../context/AppContext"

const Asset = (props) => {
    const { setPage, setCoin, menuOpened, menuClosed } = useContext(AppContext)

    const handleClick = () => {
        setCoin(props)
        setPage("COIN")
    }
    const AssetContainer = styled.div`
        background-color: #1e1e25;
        border: thin solid #3d3c3c;
        border-radius: 5px;
        height: 12em;
        display: flex;
        justify-content: space-evenly;
        align-items: center;

        padding: 0.5em;
        transition: all 0.3s;
        cursor: pointer;

        :active {
            scale: 0.95;
        }
        & .logo {
            & img {
                height: 6em;
                @media screen and (min-width: 720px) {
                    height: 8em;
                }
            }
        }

        & .info {
            width: 50%;
        }

        & .name {
            font-family: Roboto Mono;
            font-weight: 700;
            font-size: 1.3em;
            margin-bottom: 1em;
        }

        & .pl {
            font-family: Roboto;
            font-size: 0.55em;
            font-weight: 400;
        }
        & .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            margin: 10px;
            font-size: 0.8em;
        }

        & .row-heading {
            color: #aeaeae;
            font-weight: 700;
            margin-right: 1em;
        }

        & .green {
            color: green;
        }
        & .red {
            color: red;
        }
    `
    return (
        <AssetContainer
            onClick={handleClick}
            className={!menuOpened && !menuClosed ? "puff-in-center" : ""}
        >
            <div className="logo">
                <img src={props.imgURL} alt="logo" />
            </div>
            <div className="info">
                <div className="name">
                    {props.symbol}{" "}
                    <div
                        className={
                            props.price > props.avg
                                ? "green pl"
                                : props.price < props.avg
                                ? "red pl"
                                : ""
                        }
                    >
                        {props.price >= props.avg ? "+" : "-"}
                        {Math.abs(
                            parseFloat(
                                (
                                    ((props.price - props.avg) / props.avg) *
                                    100
                                ).toFixed(2)
                            )
                        )}
                        %
                    </div>
                </div>
                <div className="row">
                    <div className="row-heading">Value</div>
                    <div>${(props.price * props.amount).toFixed(2)}</div>
                </div>
                <div className="row">
                    <div className="row-heading">Amount</div>
                    <div>{props.amount}</div>
                </div>
                <div className="row">
                    <div className="row-heading">Average Price</div>
                    <div>${props.avg}</div>
                </div>
            </div>
        </AssetContainer>
    )
}

export default Asset
