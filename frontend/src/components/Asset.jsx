import { useState } from "react"
import styled from "styled-components"

const Asset = (props) => {
    const [clicked, toggleClicked] = useState(false)

    const onClick = () => {
        toggleClicked(true)
        props.toggleView(true)
    }

    const AssetContainer = styled.div`
        background-color: #1e1e25;
        border: thin solid #3d3c3c;
        border-radius: 5px;
        height: 10em;
        display: flex;
        justify-content: space-evenly;
        align-items: center;

        padding: 0.5em;
        transition: all 0.5s;
        cursor: pointer;

        :active {
            scale: 0.9;
        }
        & .logo {
            & img {
                height: 8em;
            }
        }

        & .info {
            width: 50%;
        }

        & .name {
            font-family: Roboto Mono;
            font-weight: 700;
            font-size: 1.5em;
            margin-bottom: 1em;
        }

        & .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            font-size: 1.2em;
            margin: 10px;
        }

        & .row-heading {
            font-weight: 700;
        }
    `
    return (
        <AssetContainer onClick={onClick}>
            <div className="logo">
                <img
                    src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579"
                    alt=""
                />
            </div>
            <div className="info">
                <div className="name">Bitcoin</div>
                <div className="row">
                    <div className="row-heading">Amount</div>
                    <div>700</div>
                </div>
                <div className="row">
                    <div className="row-heading">Avg. Buy Price</div>
                    <div>$20,000.56</div>
                </div>
            </div>
        </AssetContainer>
    )
}

export default Asset
