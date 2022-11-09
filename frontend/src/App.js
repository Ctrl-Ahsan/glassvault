import "./App.css"
import { AppContext } from "./context/AppContext"
import Title from "./components/Title"
import Vault from "./components/Vault"
import { useContext } from "react"
import { ToastContainer } from "react-toastify"
import "../node_modules/react-toastify/dist/ReactToastify.css"

function App() {
    const { page } = useContext(AppContext)
    return (
        <>
            <div className="App">
                {!localStorage.getItem("auth") && page === "TITLE" ? (
                    <Title />
                ) : (
                    <Vault />
                )}
            </div>
            <ToastContainer theme="colored" />
        </>
    )
}

export default App
