import axios from "axios"
import styled from "styled-components"
import { toast } from "react-toastify"
import { SiBinance } from "react-icons/si"
import { FaWallet } from "react-icons/fa"
import { IoIosArrowBack } from "react-icons/io"
import { useContext, useState } from "react"
import { AppContext } from "../context/AppContext"

const Title = () => {
    const { setPage } = useContext(AppContext)
    const [toggleLogin, setToggleLogin] = useState(false)
    const [toggleKuCoin, setKToggle] = useState(false)

    const Login = () => {
        const [login, setLogin] = useState({
            key: "",
            secret: "",
        })

        const { key, secret } = login

        const onChange = (e) => {
            setLogin((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
        const onSubmit = async (e) => {
            e.preventDefault()

            const response = await axios
                .post("/login", login)
                .catch((error) => error.response)
            if (response.status !== 200) {
                toast.error(response.data)
            } else {
                console.log(response)
                localStorage.setItem(
                    "auth",
                    JSON.stringify({
                        key: response.data.encKey,
                        secret: response.data.encSecret,
                    })
                )
                setPage("VAULT")
            }
        }

        return (
            <>
                <div className="back" onClick={() => setToggleLogin(false)}>
                    <IoIosArrowBack />
                </div>
                <div className="heading">
                    <FaWallet />
                    Login
                </div>
                <form className="form" onSubmit={onSubmit}>
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
                            rel="noreferrer"
                        >
                            How do I get my API Key and Secret?
                        </a>
                    </div>
                </form>
            </>
        )
    }

    const handleKuCoin = () => {
        if (!toggleKuCoin) {
            setKToggle(true)
            setTimeout(() => {
                setKToggle(false)
            }, 3000)
        }
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
        }

        & #title {
            font-family: Roboto Mono, Arial;
            font-size: 1.5em;
            font-weight: 700;
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
                scale: 0.95;
            }
        }
        & #kucoin {
            background-color: #24ae90;
            :active {
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

        & .back {
            font-size: 2em;
            position: absolute;
            top: 1.5em;
            left: 1em;
            transition: all 0.3s;

            :hover {
                color: grey;
                cursor: pointer;
            }
            :active {
                color: grey;
                scale: 0.9;
            }
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

                :hover {
                    background-color: #016d02;
                }
                :active {
                    scale: 0.95;
                }
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
            font-size: 0.9em;

            & a {
                text-decoration: none;
            }
        }
    `

    return (
        <TitleContainer>
            {toggleLogin ? (
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
                            onClick={setToggleLogin}
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
