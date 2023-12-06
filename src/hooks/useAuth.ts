import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export const useAuth = () => {
    const { authState, saveAuthData, loading } = useContext(AuthContext)

    return {
        authState,
        saveAuthData,
        loading
    }

}