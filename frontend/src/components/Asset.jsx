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
        height: 12em;
        display: flex;
        justify-content: space-evenly;
        align-items: center;

        padding: 0.5em;
        transition: all 0.3s;
        cursor: pointer;

        :active {
            scale: 0.9;
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

        & .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            margin: 10px;
        }

        & .row-heading {
            font-weight: 700;
            margin-right: 1em;
        }
    `
    return (
        <AssetContainer onClick={onClick}>
            <div className="logo">
                <img src={props.imgURL} alt="logo" />
            </div>
            <div className="info">
                <div className="name">{props.name}</div>
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
