import styled from "styled-components"

const Asset = (props) => {
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
        <AssetContainer>
            <div className="logo">
                <img src={props.imgURL} alt="logo" />
            </div>
            <div className="info">
                <div className="name">{props.name}</div>
                <div className="row">
                    <div className="row-heading">Amount</div>
                    <div>
                        {props.amount >= 1000
                            ? props.amount.toFixed()
                            : props.amount >= 10
                            ? props.amount.toFixed(2)
                            : props.amount >= 0
                            ? props.amount.toFixed(3)
                            : props.amount.toFixed(4)}
                    </div>
                </div>
                <div className="row">
                    <div className="row-heading">Average Price</div>
                    <div>
                        {props.avg >= 1000
                            ? props.avg.toFixed()
                            : props.avg >= 10
                            ? props.avg.toFixed(2)
                            : props.avg >= 0
                            ? props.avg.toFixed(3)
                            : props.avg.toFixed(4)}
                    </div>
                </div>
            </div>
        </AssetContainer>
    )
}

export default Asset
