import { useState } from "react"
import axiosReq from "../config/axios"
import { getActualTime } from "../utils/getTime"
import Alert from "./Alert"
import AlertInterface from "../interfaces/alert.interface"
import { socket } from "../context/socketContext"
import Spinner from "./Spinner"
import { AnimatePresence, useAnimate } from "framer-motion"

type TformData = {
    phone: number | undefined,
    message: string
}

const NewChat: React.FC = () => {
    const [formData, setFormData] = useState<TformData >({
        phone: undefined,
        message: ''
    })
    const [alert, setAlert] = useState<AlertInterface>()
    const [loading, setLoading] = useState(false)
    const [scope, animate] = useAnimate()
    const userID = localStorage.getItem('typechat_userId')
    const token = localStorage.getItem('typechat_token')
    const authHeader = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }
    const hideAlert = () => {
        setTimeout(() => {
            handleAlert({error: false, alertType: 'ERROR_ALERT', msg: ''});
        }, 3000);
    }

    const handleAlert = (e:AlertInterface) => {
        setAlert(e)
    }

    const setLoadingTimeout = () => {
        animate(scope.current, {opacity: 0 },  {duration: .7})   
        setTimeout(() => {
            setLoading(false)
        }, 700);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        if( formData.phone === undefined ){
            handleAlert({ msg: "Ingresá un número de teléfono", error: true, alertType: 'ERROR_ALERT'});
            hideAlert()
            setLoading(false)
            return;
        }
        if( formData.message === '' ){
            handleAlert({ msg: "Ingresá un mensaje para enviar.", error: true, alertType: 'ERROR_ALERT'});
            hideAlert()
            setLoading(false)
            return;
        }
        
        try {
            // GET USERTWO ID  //
            const response = await axiosReq.get('/user/getbyphone/'+formData.phone , authHeader) 
            console.log(response.data);
            if(response.data.response_data._id === userID){
                setLoadingTimeout()
                handleAlert({error: true, msg: 'No puedes enviar mensajes a vos mismo.', alertType: 'ERROR_ALERT'});
                hideAlert()
                return
            }
            if(response.data.response_data === 'USER_NOT_FOUND'){
                setLoadingTimeout()
                handleAlert({error: true, msg: 'El destinatario no existe', alertType: 'ERROR_ALERT'});
                hideAlert()
                return
            }
            const userIDs = {userOne: userID, userTwo: response.data.response_data._id}

            // CREATE CHAT //
            if(userIDs.userOne !== '' || userIDs.userTwo !== ''){
                const chatCreated = await axiosReq.post('/chats/create', userIDs , authHeader)
                if(chatCreated.data.msg === 'CHAT_CREATED_SUCCESSFULLY'){
                    const message = {
                        sentBy: userIDs.userOne,
                        sentTo: userIDs.userTwo,
                        chatID: chatCreated.data.response_data._id,
                        msgType: 'text',
                        text: formData.message,
                        date: getActualTime()
                    }
                    await axiosReq.post('/messages/send', message, authHeader)
                    //EMIT SOCKET CHAT CREATED NOTIFICATION//
                    socket.emit('clientNewChatCreated', {userOne: userIDs.userOne, userTwo: userIDs.userTwo})
                    setLoadingTimeout()
                    return
                }
                if(chatCreated.data.response_data === 'CHAT_EXISTS') {
                    setLoadingTimeout()
                    handleAlert({error: true, msg: 'El chat ya existe!', alertType: 'ERROR_ALERT'});
                    hideAlert()        
                }
            }
        } catch (error) {
            setLoadingTimeout()
            if(error)
            handleAlert({error: true, msg: 'Error al iniciar chat.', alertType: 'ERROR_ALERT'});
            hideAlert()
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

  return (
    <>
        { loading &&
            <div ref={scope} className="absolute z-40 text-white mainContSettings" style={{width: '288px', height:'226px', zIndex: 2010}}>
                <Spinner/>                
            </div>
        }

        <div className="absolute text-white mainContSettings w-72 h-fit" style={{zIndex: 2000}}>
            <div className="flex flex-col items-center gap-5">
                <div className="">
                    <h3 className="text-xl font-semibold">Nuevo chat</h3>
                </div>
                <div>
                    <form onSubmit={handleSubmit} action="" className="flex flex-col items-center gap-2 ">
                        <div className="flex flex-col">
                            <span className="text-xs">Para</span>
                            <input  className=" bg-zinc-900 rounded-lg py-0.5 px-2 text-sm" onChange= {handleChange} value={formData?.phone} name="phone" type="number" placeholder="Ingresa el teléfono" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs">Mensaje</span>
                            <input  className=" plac bg-zinc-900 rounded-lg py-0.5 px-2 text-sm" onChange= {handleChange} value={formData?.message} name="message" type="text" placeholder="Escribe el primer mensaje" />
                        </div>
                        <button className="px-3 py-1 mt-3 text-sm rounded-xl bg-zinc-900 w-fit h-fit">Iniciar chat</button>
                    </form>



                </div>
            </div>
        </div>

        <AnimatePresence>
            { alert?.error &&
                <div className="flex justify-center w-full h-fit">
                    <Alert error= {alert?.error} msg={alert?.msg} alertType={alert?.alertType} />
                </div> 
            }
        </AnimatePresence>
    </>
  )
}

export default NewChat