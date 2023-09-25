import { useState } from "react"
import axiosReq from "../config/axios"
import { getActualTime } from "../utils/getTime"
import Alert from "./Alert"
import AlertInterface from "../interfaces/alert.interface"
import { socket } from "../context/socketContext"

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
    const userID = localStorage.getItem('typechat_userId')
    const token = localStorage.getItem('typechat_token')
    const authHeader = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            // GET USERTWO ID  //
            const response = await axiosReq.get('/user/getbyphone/'+formData.phone , authHeader) 
            console.log(response.data);
            if(response.data.response_data === 'USER_NOT_FOUND'){
                handleAlert({error: true, msg: 'El usuario no existe'});
                return
            }
            const userIDs = {userOne: userID, userTwo: response.data.response_data._id}

            // CREATE CHAT //
            if(userIDs.userOne !== '' || userIDs.userTwo !== ''){
                console.log('in if');
                
                const chatCreated = await axiosReq.post('/chats/create', userIDs , authHeader)
                console.log(chatCreated.data);
                if(chatCreated.data.msg === 'CHAT_CREATED_SUCCESSFULLY'){
                    const message = {
                        sentBy: userIDs.userOne,
                        sentTo: userIDs.userTwo,
                        chatID: chatCreated.data.response_data._id,
                        msgType: 'text',
                        text: formData.message,
                        date: getActualTime()
                    }
                    const response = await axiosReq.post('/messages/send', message, authHeader)
                    console.log(response);
                    //EMIT SOCKET CHAT CREATED NOTIFICATION//
                    socket.emit('clientNewChatCreated', {userOne: userIDs.userOne, userTwo: userIDs.userTwo})
                }
            }
        } catch (error) {
            console.log('usuario no existe')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleAlert = (e:AlertInterface) => {
        setAlert(e)
    }

  return (
    <div className="absolute text-white mainContSettings w-72 h-fit ">
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
                {
                        alert?.error &&
                        <div className="flex justify-center w-full h-fit">
                            <Alert error= {alert?.error} msg={alert?.msg} />
                        </div>
                }

            </div>
        </div>
    </div>
  )
}

export default NewChat