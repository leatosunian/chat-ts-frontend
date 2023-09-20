import { useEffect, useState } from "react"
import axiosReq from "../config/axios"


const Sidebar = () => {
    type userdata = {
        name: string,
    }
    type chatype = [
        {
            userId: string,
            name: string,
            lastMsg: string,
            _id: string,
            createdAt: Date,
            updatedAt: Date
        }
    ]

    const [ userData, setUserData ] = useState<userdata>()
    const [ chats, setChats ] = useState<chatype>()

    const getChats = async () => {
        const userId = localStorage.getItem('typechat_userId')
        const token = localStorage.getItem('typechat_token')
        const authHeader = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const response = await axiosReq.get('/user/get/'+userId, authHeader)
            setUserData(response.data.response_data.user_data)
            setChats(response.data.response_data.chats)
                          
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getChats()
    }, [] )

    

  return (
    <div className="flex flex-col w-1/4 h-full gap-4 ">

        <div className="flex w-full p-3 border-b border-black/25 h-fit ">

            <div className="flex items-center justify-between w-full">

                <div className="flex items-center gap-5">
                    <img src="../../public/assets/user.png" alt=""     className="w-12 h-12"/>
                    <span className="font-medium text-white">
                        {userData?.name}
                    </span>
                </div>

                <div className="">
                    <img className="w-4 h-4" src="../../public/assets/more.png" alt="" />
                </div>

            </div>

        </div>

        <div className="flex flex-col w-full h-full gap-3 px-3">

            <div>
                <span>Chats</span>
                <button className="w-fit h-fit px-3 py-2 bg-gray-500">
                    <img className="w-40" src="../../public/assets/newmsg.png" alt="" />
                </button>
            </div>

            {chats?.map( chat => 
                <div key={chat.userId} className="flex items-center gap-4 py-3 border-t border-b border-black/25">
                <img src="../../public/assets/user.png" alt="" className="w-11 h-11" />
                
                <div >
                    <span className="text-xs font-semibold leading-none text-white">{chat.name} </span>
                    <p className="text-xs text-white">{chat.lastMsg}</p>
                </div>
            </div>
            )}
                
        </div>
        

    </div>
  )
}

export default Sidebar