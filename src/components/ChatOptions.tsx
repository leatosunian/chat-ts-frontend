import axiosReq from "../config/axios"
import Spinner from "./Spinner";
import { AnimatePresence, motion, useAnimate } from 'framer-motion';
import { userData } from "../interfaces/user.interface";
import { useEffect, useState } from "react";
import Alert from "./Alert";
import AlertInterface from '../interfaces/alert.interface';    
    

type chatOptionsProps = {
    userId: string | undefined;
    chatId: string;
    refreshChatDeleted: () => void;
}


const ChatOptions: React.FC<chatOptionsProps> = ({userId, chatId, refreshChatDeleted}) => {

    const [loading, setLoading] = useState(true)
    const [scope, animate] = useAnimate()
    const [userData, setUserData] = useState<userData>({
        name: '',
        userInfo: '',
        phone: undefined,
        profileImage:''
    })
    const [alert, setAlert] = useState<AlertInterface>()
    const token = localStorage.getItem('typechat_token')

    const authHeader = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }

    const setLoadingTimeout = () => {
        animate(scope.current, {opacity: 0 },  {duration: .5}) 
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }

    const getProfileData = async (userId:string | undefined) => {
        try {
            const response = await axiosReq.get('/user/getdata/'+userId, authHeader)
            console.log(response);
            
            setUserData(response.data.response_data)
            setLoadingTimeout()
        } catch (error) {
            console.log(error)
        }
    }

    const handleAlert = (e:AlertInterface) => {
        setAlert(e)
    }

    const hideAlert = () => {
        setTimeout(() => {
            handleAlert({error: false, alertType: 'ERROR_ALERT', msg: ''});
        }, 4000);
    }

    const doubleClickAlert = () => {
        handleAlert({error: true, alertType: 'ERROR_ALERT', msg: 'Hacé doble click para eliminar'});
        hideAlert()
    }
    
    const deleteChat = async () => {
        const deletedChat = await axiosReq.delete('/chats/delete/'+chatId, authHeader)
        console.log(deletedChat);
        if(deletedChat.data === 'CHAT_DELETED_SUCCESSFULLY'){
            handleAlert({error: true, alertType: 'OK_ALERT', msg: 'El chat ha sido eliminado!'});
            hideAlert()
            refreshChatDeleted()
        } 
        if(deletedChat.data === 'CHAT_DELETE_ERROR') {
            handleAlert({error: true, alertType: 'ERROR_ALERT', msg: 'No se pudo eliminar el chat.'});
        }
        
        
    }

    useEffect(() => {
      getProfileData(userId)
    }, [userId])
    

return (
    <>
        { loading &&
            <div ref={scope} className="absolute z-40 text-white mainContChatOptions" >
                <Spinner/>                
            </div>
        }

        <div className="absolute z-30 text-white mainContChatOptions w-30 h-fit ">
            <div className="flex flex-col items-center gap-3">
                <div className="rounded-full inputFileForm" title="Cambiar foto de perfil" >
                    <img className="w-16 rounded-full" src={`${import.meta.env.VITE_BACKEND_URL}/api/user/getprofilepic/`+userData.profileImage} alt="" />
                </div>

                <div>
                    <div className="flex flex-col items-center gap-1 ">
                        <div className="flex flex-col">
                            <span style={{fontWeight: '500'}} className="py-0.5 px-2 text-xl">{userData.name} </span>
                        </div>
                        <div className="flex flex-col">
                            <span  className="py-0.5 px-2 text-xs cursor-pointer" title={userData.userInfo}> {userData.userInfo.substring(0, 38)} {userData.userInfo.length >= 38 && '...'} </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="py-0.5 px-2 text-xs">{userData.phone}</span>
                        </div>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={doubleClickAlert} onDoubleClick={deleteChat} className="px-3 py-1.5 mt-5 text-xs rounded-xl bg-red-600 w-fit h-fit">Eliminar chat</motion.button>
                    </div>
                </div>

                
            
            </div>
        </div>

        <AnimatePresence>
            { alert?.error && <Alert msg={alert.msg} error={alert.error} alertType={alert?.alertType}  /> }
        </AnimatePresence>
    </>
)
}

export default ChatOptions