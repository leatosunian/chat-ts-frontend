import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const LoggedInLayout = () => {

    const { authState, loading } = useAuth()
    if(loading) return 'cargando'
    
    return (
        <>
            {authState.token === '' ? <Outlet/> : <Navigate to='/home' />}
        </>
    )
}

export default LoggedInLayout