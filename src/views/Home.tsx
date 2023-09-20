import ChatMessagesBox from "../components/ChatMessagesBox"
import { useEffect, useState, SetStateAction, useContext } from 'react';
import axiosReq from "../config/axios"
import { SocketContext } from "../context/socketContext"
import { messageInterface } from '../interfaces/message.interface';
import ProfileSettings from "../components/ProfileSettings";
import NewChat from "../components/NewChat";

const Home = () => {

    type userdata = {
        name: string,
        _id: string
    }

    type chatype = 
        {
            userId: string,
            name: string,
            lastMsg: string,
            chatId: string,
            createdAt: Date,
            updatedAt: Date
        }
    

    type chatProps = {
        sentBy: string,
        sentTo: string
    }

    type socketData = {
        msg: messageInterface,
        room: string
    }

    const [ userData, setUserData ] = useState<userdata>()
    const [ chats, setChats ] = useState<chatype[]>()
    const [ chatProps, setChatProps] = useState<chatProps>({
    sentBy: '',
    sentTo: ''
    })
    const socket = useContext(SocketContext)
    const [socketData, setSocketData] = useState<socketData>()
    const [settingsActive, setSettingsActive] = useState(false)
    const [newMsgActive, setNewMsgActive] = useState(true)


    const handleClick:React.MouseEventHandler<HTMLDivElement> = async (e) => {
        e.preventDefault()
        const sentTo = ( e.currentTarget as HTMLDivElement).id.toString()
        const sentBy = localStorage.getItem('typechat_userId') || ''
        //const test = ( e.currentTarget as HTMLDivElement)
        //console.log(e.currentTarget.getAttribute('data-chatID') );
        //console.log(test);
        
        const payload: SetStateAction<chatProps>= {
            sentBy,
            sentTo
        }
        setChatProps(payload)                
    }

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

    const handleSettingClick = () => {
        if(!settingsActive) {
            setSettingsActive(true)
        } else {
            setSettingsActive(false)
        }
        
    }

    const handleNewMsgClick = () => {
        if(!newMsgActive) {
            setNewMsgActive(true)
        } else {
            setNewMsgActive(false)
        }
    }

    const updateLastMsg = (data: { msg: messageInterface; room: string; }) => {
        console.log(data.room);
        console.log(data.msg);
        
        /*const updatedChats = chats?.map( chat => chat.chatId === data.room ? { ...chat, lastMsg: data.msg.text } : chat)
        console.log(updatedChats);

        setChats(updatedChats)*/
        console.log({chats});
        getChats()
        
        const chatToUpdateIndex = chats?.findIndex((chat => chat.chatId === data.room))

        console.log(chatToUpdateIndex);
        
    }

    useEffect(() => {
        getChats()
    }, [] )

    // socket useEffect //
    useEffect(() => {
        socket.on('serverMsg', (data) => {
            setSocketData(data)
            getChats()
        })
        socket.on('incomingMsgNotification', (data) => {
            console.log(data);
            
            console.log('llego la notificacion');
            
            updateLastMsg(data)
        })
        return () => {
            socket.off('serverMsg')
            socket.off('incomingMsgNotification')
        }
    }, [socket])


    return (
        <>
            <div className="flex w-screen h-screen backgroundColor ">
                <div className="flex flex-col w-1/4 h-full gap-4 ">
                    <div className="flex w-full p-3 border-b border-black/25 h-fit ">

                        <div className="flex items-center justify-between w-full">

                            <div className="flex items-center gap-5">
                                <img src="../../public/assets/user.png" alt=""     className="w-12 h-12"/>
                                <span className="font-medium text-white">
                                    {userData?.name}
                                </span>
                            </div>

                            <div className="" >
                                <img onClick={handleSettingClick} className="w-4 h-4" src="../../public/assets/more.png" alt="" />
                                { settingsActive && <ProfileSettings userId={userData?._id} /> }
                                { newMsgActive && <NewChat/> }
                            </div>
                            
                        </div>
                    </div>

                    <div className="flex flex-col w-full h-full gap-3 px-3">

                        <div className="flex justify-between px-2">
                            <span className="text-lg font-semibold text-white">Chats</span>
                            <button onClick={handleNewMsgClick} className="p-2 bg-gray-700 w-fit h-fit rounded-xl">
                                <img className="w-4" src="../../public/assets/newmsg.png" alt="" />
                            </button>
                        </div>

                        {chats?.map( chat => 
                            <div onClick={handleClick} key={chat.userId} id={`${chat.userId}` } className="flex items-center gap-4 py-3 border-t border-b border-black/25">
                                <img src="../../public/assets/user.png" alt="" className="w-11 h-11" />
                                <div>
                                    <span className="text-xs font-semibold leading-none text-white">{chat.name} </span>
                                    <p className="text-xs text-white">{chat.lastMsg}</p>
                                </div>
                            </div>
                        )}
                                
                    </div>  
                </div>

                <ChatMessagesBox sentBy={chatProps?.sentBy} sentTo={chatProps?.sentTo} />

            </div>
        </>
    )
}

export default Home