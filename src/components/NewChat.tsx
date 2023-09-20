import { useEffect, useState } from "react"
import axiosReq from "../config/axios"


type userData = {
    phone: number,
}

type newChatUsers = {
    userOne: string,
    userTwo: string
}

const NewChat: React.FC = () => {
    const [newChatData, setNewChatData] = useState<userData>({
        phone: '',
        message: '',
        phone: undefined,
    })

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
            const response = await axiosReq.put('/user/update', userData, authHeader)  
            setUserData(response.data.response_data)
                      
        } catch (error) {
            console.log(error);
        }

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({...userData, [e.target.name]: e.target.value})
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
                        <input  className=" bg-zinc-900 rounded-lg py-0.5 px-2 text-sm" onChange= {handleChange} value={userData?.name} name="name" type="number" placeholder="Ingresa el teléfono" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs">Mensaje</span>
                        <input  className=" plac bg-zinc-900 rounded-lg py-0.5 px-2 text-sm" onChange= {handleChange} value={userData?.userInfo} name="userInfo" type="text" placeholder="Escribe el primer mensaje" />
                    </div>
                    <button className="px-3 py-1 mt-3 text-sm rounded-xl bg-zinc-900 w-fit h-fit">Iniciar chat</button>
                </form>

            </div>
        </div>
    </div>
  )
}

export default NewChat