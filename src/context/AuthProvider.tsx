import { useEffect, useReducer, useState } from "react";
import { AuthContext } from "./AuthContext";
import { authReducer } from "./AuthReducer";
import { IAuthContextState } from "../interfaces/auth.interface";
import axiosReq from "../config/axios";

interface props {
    children: JSX.Element | JSX.Element[]
}

const authInitialState = {
    userID: '',
    token: '' 
}

export const AuthProvider = ({children}:props) => {

    const [authState, dispatch] = useReducer(authReducer, authInitialState)
    const [loading, setLoading] = useState(true)

    const saveAuthData = (loginData: IAuthContextState) => {
        dispatch({ type: 'saveAuthData', payload: loginData })
    }

    useEffect(() => {
        
        const checkUserAuth = async () => {
            const userID = localStorage.getItem('typechat_userId')
            const token = localStorage.getItem('typechat_token')
            if(!token) {
                setLoading(false)
                return
            }

            const authHeader = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const {data} = await axiosReq.get('/user/getdata/'+userID, authHeader)
                const loginData: IAuthContextState = {
                    userID: data.response_data._id,
                    token
                }
                if(data.msg === 'USER_GET_SUCCESSFULLY'){
                    saveAuthData(loginData)
                }
                setLoading(false)
            
            } catch (error) {
                console.log(error)
            }
        }
        checkUserAuth()
    }, [])
    

    return (
        <AuthContext.Provider value={{authState, saveAuthData, loading}}>
            {children}
        </AuthContext.Provider>
    )
}