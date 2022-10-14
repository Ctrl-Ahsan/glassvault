import { useState } from "react"
import styled from "styled-components"
import Asset from "./Asset"

const Vault = () => {
    const [view, toggleView] = useState(false)
    const VaultContainer = styled.section`
        min-height: 100vh;

        & .heading {
            font-size: 3em;
            font-weight: 700;
            display: flex;
            margin: 1em;
            margin-bottom: 1em;
        }

        & .list {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            column-gap: 4vw;
            row-gap: 30px;

            margin: 1em;

            @media screen and (max-width: 2600px) {
                ${view
                    ? "grid-template-columns: 1fr;"
                    : "grid-template-columns: 1fr 1fr;"}
            }
            @media screen and (max-width: 1800px) {
                grid-template-columns: 1fr;
            }

            ${view ? "grid-template-columns: 1fr;" : ""}
        }
    `
    return (
        <VaultContainer>
            <div className="heading">Vault</div>
            <div className="list">
                <Asset toggleView={toggleView} />
                <Asset />
                <Asset />
                <Asset />
                <Asset />
                <Asset />
            </div>
        </VaultContainer>
    )
}

export default Vault
