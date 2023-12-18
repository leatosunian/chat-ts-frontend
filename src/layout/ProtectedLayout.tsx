import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import Spinner from "../components/Spinner";

const ProtectedLayout = () => {
    const { authState, loading } = useAuth()
    if(loading) return (
        <>
            <div className="absolute z-50 flex w-screen h-screen backgroundColor ">
                <Spinner/>
            </div>
        </>
    )
    return (
        <>
            {authState.token !== '' ? <Outlet/> : <Navigate to='/login' />}
        </>
  )
}

export default ProtectedLayout