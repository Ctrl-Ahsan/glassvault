import { createContext, useState } from "react"

export const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
    const [page, setPage] = useState("TITLE")

    const value = { page, setPage }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
