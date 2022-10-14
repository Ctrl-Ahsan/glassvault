import axios from "axios"
import styled from "styled-components"
import { SiBinance } from "react-icons/si"
import { FaWallet } from "react-icons/fa"
import { useState } from "react"

const Title = () => {
    const [toggleBinance, setBToggle] = useState(false)
    const [toggleKuCoin, setKToggle] = useState(false)

    const Login = () => {
        const [login, setLogin] = useState({
            label: "",
            key: "",
            secret: "",
        })

        const { label, key, secret } = login

        const onChange = (e) => {
            setLogin((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
        const onSubmit = (e) => {
            e.preventDefault()
        }

        return (
            <>
                <div className="heading">
                    <FaWallet />
                    Login
                </div>
                <form className="form" onSubmit={onSubmit}>
                    <div className="form-item">
                        <input
                            required
                            type="text"
                            name="label"
                            value={label}
                            placeholder="Wallet Nickname"
                            onChange={onChange}
                        />
                    </div>
                    <div className="form-item">
                        <input
                            required
                            type="text"
                            name="key"
                            value={key}
                            placeholder="API Key"
                            onChange={onChange}
                        />
                    </div>
                    <div className="form-item">
                        <input
                            required
                            name="secret"
                            value={secret}
                            placeholder="Secret"
                            onChange={onChange}
                        />
                    </div>
                    <button type="submit" className="submit">
                        Connect
                    </button>
                    <div className="link">
                        <a
                            href="https://www.binance.com/en/support/faq/360002502072"
                            target="_blank"
                        >
                            How do I get my API Key and Secret?
                        </a>
                    </div>
                </form>
            </>
        )
    }

    const handleKuCoin = () => {
        setKToggle(true)
        setTimeout(() => {
            setKToggle(false)
        }, 3000)
    }

    const TitleContainer = styled.section`
        color: white;

        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        & .icon {
            margin-top: 30vh;
        }

        & #vaultImg {
            height: 10em;
            margin: 0.5em;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        & #title {
            font-family: Roboto Mono, Arial;
            font-size: 1.5em;
            font-weight: 100;
            margin: 0.5em;
            margin-top: 0;
            margin-bottom: 1em;
        }

        & button {
            color: inherit;
            border: none;
            font: inherit;
            cursor: pointer;
            transition: all 0.3s;
        }

        & .buttons {
            margin-bottom: 15vh;
        }

        & .connect {
            width: 12em;
            font-weight: 700;
            margin: 0.5em;
            padding: 0.6em 0.4em;
            border-radius: 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            position: relative;
        }

        & #binance {
            background-color: #efb90a;
            margin-top: 2em;
            :active {
                scale: 0.9;
            }
        }
        & #kucoin {
            background-color: #24ae90;
            :hover {
                background-color: #686868;
            }
        }

        & .coming {
            font-size: 0.6em;
            font-weight: 500;
            background-color: grey;
            position: absolute;
            top: 5em;
            padding: 10px;
            border-radius: 20px;
        }

        & .login {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: left;
            margin-bottom: 15vh;
            width: 80vw;
            height: 100%;
            max-width: 500px;

            & input {
                background-color: #2a2a2a;

                width: 100%;
                font-size: 1em;
                margin-bottom: 0.5em;
                padding: 10px;
                border-radius: 10px;
                border: none;
            }
        }
        & .heading {
            font-size: 2em;
            font-weight: 700;
            padding: 10px 20px;
            margin-bottom: 0.5em;

            & svg {
                margin-right: 10px;
            }
        }
        & .labels {
            display: flex;
            justify-content: left;
            text-align: left;
            width: 100%;
        }
        & .form {
            width: 80%;
            max-width: 500px;

            & button {
                background-color: #019003;
                font-weight: 700;

                width: 100%;
                padding: 0.6em 0.4em;
                border-radius: 10px;
            }
        }

        & .form-title {
            font-size: 1.5em;
            font-weight: 700;
            padding: 10px 20px;
            margin-bottom: 0.5em;
        }

        & .form-item {
            margin-bottom: 10px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            & input {
                width: 100%;
                font-size: 0.7em;
                font-family: inherit;
                padding: 10px;
                border: 0.1px solid #2a2a2a;
                border-radius: 5px;
                background-color: #333333;
                color: white;

                @media screen and (min-width: 740px) {
                    padding: 15px;
                }
                @media screen and (min-width: 1080px) {
                    padding: 20px;
                }
            }
        }
        & .link {
            margin: 10px;
            font-size: 0.7em;

            & a {
                text-decoration: none;
            }
        }
    `

    return (
        <TitleContainer>
            {toggleBinance ? (
                <Login />
            ) : (
                <>
                    <div className="icon">
                        <img src="/vault.png" alt="vault" id="vaultImg" />
                        <div id="title">GlassVault</div>
                    </div>
                    <div className="buttons">
                        <button
                            className="connect"
                            id="binance"
                            onClick={setBToggle}
                        >
                            <div>
                                <SiBinance />
                            </div>
                            <div>Connect with Binance</div>
                        </button>
                        <button
                            className="connect"
                            id="kucoin"
                            onClick={handleKuCoin}
                        >
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 2286.76 2500.03"
                                    width="0.9em"
                                >
                                    <title>kcs</title>
                                    <path
                                        d="M1924.48 1522.23l-468.47 466.28-747.84-739.81 746.41-738.61 469.9 467.7c83.34 82.63 217.92 82.63 300.54-.72s82.26-217.92-.72-300.54L1606.62 61.74c-83.34-82.62-217.92-82.26-300.54.72-.34.34-15.07 12.57-21.65 19.12L425.02 931.75V423.61c0-117.25-95.25-212.5-212.51-212.5S.36 306.36 0 423.61v1651.4c0 117.26 95.25 212.51 212.51 212.51s212.51-95.29 212.51-212.51v-509.26l859.41 850.17c3.71 3.69 18.08 18.05 21.65 21.65 82.62 83 217.2 83.34 300.54.72l617.68-614.8c83-82.62 83.34-217.19.72-300.54-82.98-82.94-217.56-83.34-300.54-.72z"
                                        fill="#ffffff"
                                    />
                                    <circle
                                        cx="1457.97"
                                        cy="1250.2"
                                        r="214.31"
                                        fill="#ffffff"
                                    />
                                </svg>
                            </div>
                            <div>Connect with KuCoin</div>
                            {toggleKuCoin ? (
                                <div className="coming">Coming Soon!</div>
                            ) : (
                                ""
                            )}
                        </button>
                    </div>
                </>
            )}
        </TitleContainer>
    )
}

export default Title