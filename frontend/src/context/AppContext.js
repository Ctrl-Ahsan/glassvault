import { createContext, useState } from "react"

export const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
    const [page, setPage] = useState("TITLE")
    const [coin, setCoin] = useState({})

    const value = { page, setPage, coin, setCoin }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
