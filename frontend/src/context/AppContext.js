import { createContext, useState } from "react"

export const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
    const [page, setPage] = useState("TITLE")
    const [menuOpened, setMenuOpened] = useState(false)
    const [menuClosed, setMenuClosed] = useState(false)
    const [summaryOpened, setSummaryOpened] = useState(false)
    const [assets, setAssets] = useState([])
    const [coin, setCoin] = useState({})
    const [stats, setStats] = useState({})

    const value = {
        page,
        setPage,
        menuOpened,
        setMenuOpened,
        menuClosed,
        setMenuClosed,
        summaryOpened,
        setSummaryOpened,
        coin,
        setCoin,
        assets,
        setAssets,
        stats,
        setStats,
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
