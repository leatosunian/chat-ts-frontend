import ChatMessagesBox from "../components/ChatMessagesBox"
import { useEffect, useState, SetStateAction, useContext } from 'react';
import axiosReq from "../config/axios"
import { SocketContext } from "../context/socketContext"
import { messageInterface } from '../interfaces/message.interface';
import ProfileSettings from "../components/ProfileSettings";
import NewChat from "../components/NewChat";
import Chat from "../components/Chat";
import Spinner from "../components/Spinner";
import { useAnimate, motion } from 'framer-motion';

export type chatype = {
    userId: string,
    name: string,
    lastMsg: string,
    chatId: string,
    createdAt: Date,
    updatedAt: Date,
    profileImage: string
}


const Home = () => {

    type userdata = {
        name: string,
        _id: string,
        profileImage: string
    }

    type chatProps = {
        sentBy: string|null,
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
    const [newMsgActive, setNewMsgActive] = useState(false)
    const [activeChat, setActiveChat] = useState('')
    const [loading, setLoading] = useState(true)

    const [scope, animate] = useAnimate()

    const userId = localStorage.getItem('typechat_userId')

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
        setActiveChat(sentTo)
        /*e.currentTarget.classList.toggle('selected');*/              
    }

    const getChats = async () => {
        
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
            setLoadingTimeout()
                   
        } catch (error) {
            console.log(error)
        }
    }

    const setLoadingTimeout = () => {
        animate(scope.current, {opacity: 0 },  {duration: .7})   
        setTimeout(() => {
            setLoading(false)
        }, 700);
    }

    const handleSettingClick = () => {
        if(newMsgActive) {
            setNewMsgActive(false)
        }

        if(!settingsActive) {
            setSettingsActive(true)
        } else {
            setSettingsActive(false)
        }
        
    }

    const handleNewMsgClick = () => {
        if(settingsActive) {
            setSettingsActive(false)
        }

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

    const updateChatLastMsg = (message: messageInterface, userId: string | undefined ) => {
        console.log(message);
        console.log(userId);
        console.log(chats?.length);
        console.log(message.sentBy);
        console.log(message.sentTo);

        const chatToUpdate = chats?.find(chat => chat.userId === message.sentBy || chat.userId === message.sentTo )
        console.log(chatToUpdate);
        
        /*const updatedChats = chats?.map( chat => chat.chatId === data.room ? { ...chat, lastMsg: data.msg.text } : chat)
        console.log(updatedChats);*/
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
            updateLastMsg(data)
        })
        socket.on('serverNewChatCreated', (roomUsers) => {
            console.log(roomUsers);
            if(roomUsers.userOne === userId){
                const sentBy = roomUsers.userOne
                const sentTo = roomUsers.userTwo
                const payload: SetStateAction<chatProps>= {
                    sentBy,
                    sentTo
                }
                
                setChatProps(payload)
                getChats()
                setNewMsgActive(false)
            }
            
        })
        return () => {
            socket.off('serverMsg')
            socket.off('incomingMsgNotification')
            socket.off('serverNewChatCreated')
        }
    }, [socket])

    /*const showSpinner = () => {
        return (
            <div ref={scope} className="flex w-screen h-screen backgroundColor ">
                <Spinner/>
            </div>
        )
    }*/


    return (
        <>
            { loading &&
            <div ref={scope} className="absolute z-50 flex w-screen h-screen backgroundColor ">
                <Spinner/>
            </div>
            }
            
            <div className="flex w-screen h-screen backgroundColor ">
                
                {/* sidebar */}
                <div className="flex flex-col h-full gap-4" style={{width: '400px', minWidth:'370px'}}>
                    <div className="flex w-full p-3 border-b border-black/25 h-fit ">

                        <div className="flex items-center justify-between w-full">

                            <div className="flex items-center gap-5">
                                <div className="rounded-full sidebarProfileImage" onClick={handleSettingClick}>
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/api/user/getprofilepic/`+userData?.profileImage} alt="" className="w-12 h-12 rounded-full"/>   
                                </div> 
                                
                                <span className="font-medium text-white" title="Editar perfil">
                                    {userData?.name }
                                </span>
                            </div>

                            <div className="" >
                                <motion.img title="Editar perfil" whileTap={{ scale: 0.9 }} onClick={handleSettingClick} className="w-4 h-4" src="../../public/assets/more.png" alt="..." />

                                { settingsActive && 
                                    <ProfileSettings userId={userData?._id} refreshProfile={ () => getChats() } /> 
                                }
                                
                                { newMsgActive && <NewChat/> }
                            </div>
                            
                        </div>
                    </div>

                    <div className="flex flex-col w-full h-full gap-3 px-2">

                        <div className="flex justify-between px-2">
                            <span className="text-lg font-semibold text-white">Chats</span>
                            <motion.button whileHover={{backgroundColor: 'rgb(75, 75, 75)'}} whileTap={{ scale: 0.9 }} onClick={handleNewMsgClick} className="p-2 w-fit h-fit rounded-xl" style={{backgroundColor: 'rgb(59, 59, 59)'}} title="Nuevo chat">
                                <img className="w-4" src="../../public/assets/newmsg.png" alt="" />
                            </motion.button>
                        </div>

                        {chats?.map( chat => 
                            <Chat  key={chat.userId} handleClickProp={(e) => {handleClick(e)}} userId={chat.userId} profileImage={chat.profileImage} name={chat.name} lastMsg={chat.lastMsg} activeChat={activeChat} />
                        )}
                                
                    </div>  
                </div>

                {/* sidebar end */}
                
                <ChatMessagesBox sentBy={chatProps?.sentBy} sentTo={chatProps?.sentTo} onNewMessage={(message, userId) => {updateChatLastMsg(message, userId)}} />

            </div>           
        </>
    )
}


export default Home