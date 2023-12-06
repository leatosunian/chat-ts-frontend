import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const ProtectedLayout = () => {

    const { authState, loading } = useAuth()
    console.log(authState);
    if(loading) return 'cargando'
    return (
        <>
            {authState.token !== '' ? <Outlet/> : <Navigate to='/login' />}
        </>
  )
}

export default ProtectedLayout