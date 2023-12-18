import { useState, useEffect, FormEventHandler, useContext } from 'react';
import axiosReq from "../config/axios"
import { getActualTime } from '../utils/getTime';
/*import { socket } from '../utils/useSocket';*/
import { messageInterface } from '../interfaces/message.interface';
import { SocketContext } from '../context/socketContext';
import { motion } from 'framer-motion';
import paperplane from '../assets/paper-plane.png'
import paperclip from '../assets/paper-clip.png'
import happy from '../assets/happy.png'
import tcsquare1 from '../assets/tcsquare1.png'
import ChatOptions from './ChatOptions';
import more from '../assets/more.png'
interface chatProps {
    sentBy: string|null;
    sentTo: string;
    onChatDelete: () => void
    onNewMessage: (message: messageInterface, userId: string | undefined ) => void ;
} 

type userTwo = {
    _id:string,
    name:string,
    email:string,
    phone:string,
    userInfo: string,
    profileImage: string
}

const ChatMessagesBox: React.FC<chatProps> = ({sentBy, sentTo, onNewMessage, onChatDelete}) => {

    const [ messages, setMessages ] = useState<Array<messageInterface>>([])
    const [ textInput, setTextInput ] = useState('')
    const [ userTwoData, setUserTwoData ] = useState<userTwo>()
    const [ chatId , setChatId ] = useState('')
    const socket = useContext(SocketContext)
    const [isChatSelected, setIsChatSelected] = useState(false)
    const [chatOptionsActive, setChatOptionsActive] = useState(false)

    const userActiveId = localStorage.getItem('typechat_userId')
    const token = localStorage.getItem('typechat_token')
    const authHeader = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }

    const getChats = async () => {
        try {
            const response = await axiosReq.get('/chats/get/'+sentBy+'/'+sentTo, authHeader)
            setChatId(response.data.response_data.chatId)
            setMessages(response.data.response_data.messages)
            setUserTwoData(response.data.response_data.userTwoData)    
            setIsChatSelected(true) 
        } catch (error) {
            console.log(error)
        }        
    }

    const handleSubmit:FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if(textInput != ''){
            const msg = {
                text: textInput,
                sentBy,
                sentTo,
                chatID: chatId,
                msgType: 'text',
                date: getActualTime()
            }

            try {
                await axiosReq.post('/messages/send', msg, authHeader)
                socket.emit('clientMsg', {room: chatId, msg })
                setMessages( messages => [ msg, ...messages ]) 
                setTextInput('')                                
            } catch (error) {
                console.log(error)
            }
        }
    }    
    
    const handleChatOptions = () => {
        if(!chatOptionsActive) {
            setChatOptionsActive(true)
        } else {
            setChatOptionsActive(false)
        }

    }

    // selected chat useEffect //
    useEffect(() => {
        getChats()
    }, [sentTo]) 

    // socket useEffect //
    useEffect(() => {
        socket.on('serverMsg', (data) => {
            console.log(data);
            setMessages( messages => [data.msg, ...messages])  
            onNewMessage(data.msg, userTwoData?._id)       
        })
        return () => {
            socket.off('serverMsg')
        }
    }, [socket])
    
    // join socket room useEffect //
    useEffect(() => {
        if(chatId !== ''){
            socket.emit('joinRoom', chatId)
        }
    }, [chatId])


    const ChatDelete = () => {
        setIsChatSelected(false) 
        onChatDelete()
        setChatOptionsActive(false)
    }

  return (
    <>
    
        {/* { loading && sentTo &&
            <div ref={scope} className="absolute right-0 z-20 w-5/6 h-full border-l backgroundColor border-black/25">
                <Spinner/>
            </div>
        } */}

        <div className="z-10 w-5/6 h-full border-l border-black/25">
            
            <div className="flex flex-col w-full h-full ">


                { !isChatSelected && 
                    <>
                        <div className='flex flex-col items-center justify-center w-full h-full gap-4'>
                            <img className='w-64' src={tcsquare1} alt="" />
                            <h1 className='text-xl font-semibold text-white'>TypeChat for Windows</h1>
                            <span className='text-sm font-normal text-white'>
                                ¡Selecciona un chat o inicia uno nuevo para comenzar a hablar!
                            </span>
                        </div>
                    </>
                }

                { isChatSelected && 
                    <>
                        <div className="flex items-center justify-between w-full px-5 py-3 border-b border-black/25">
                            <div className="flex items-center gap-5">

                                <div className="rounded-full sidebarProfileImage">
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/api/user/getprofilepic/`+userTwoData?.profileImage} alt="" className="w-12 h-12 rounded-full"/>   
                                    </div>
                                <span className="font-medium text-white">
                                    {userTwoData?.name}
                                </span>
                            </div>

                            <div className="">
                                <motion.img whileTap={{ scale: 0.9 }} className="w-4 h-4" src={more} alt="" onClick={handleChatOptions}/>
                                { chatOptionsActive && <ChatOptions userId={userTwoData?._id} chatId={chatId} refreshChatDeleted={ () => ChatDelete() } /> }
                            </div>


                        </div>

                        {/* MESSAGES CONTAINER */}
                        <div className="flex flex-col w-full text-white messageBox ">
                            <div className="flex flex-col-reverse w-full h-full px-32 overflow-y-scroll chatScroll">
                                { messages?.map( (message, index) => {
                                    const msgReceivedClass = 'max-w-md px-3 py-2 mb-2 border w-fit h-fit rounded-xl border-black/25 messageRBgColor'
                                    const msgSentClass = 'max-w-md px-3 py-2 mb-2 border w-fit h-fit rounded-xl border-black/25 messageBgColor'
                                    let msgIsSent = null
                                    if(message.sentBy === userActiveId ) {
                                        msgIsSent = true
                                    }
                                    
                                    return <motion.div initial={{ opacity: 0, scale: 0.4 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }} key={index} className={ msgIsSent ? msgSentClass : msgReceivedClass}>  
                                        <p className="text-xs w-fit">{message.text} </p>
                                        <span className="relative top-0 left-0 self-end block ml-2 text-end msgTime">{message.date}</span>
                                    </motion.div>    
                                })}
                            </div>
                        </div>

                        {/* TEXT INPUT */}
                        <div className="flex items-center justify-between w-full border-t border-black/25 h-14 ">
                            <div className="flex gap-10 px-5 w-fit h-fit">
                                <img src={happy} className="w-5 h-5"/>
                                <img src={paperclip} className="w-5 h-5" />
                            </div>
                            <form onSubmit={handleSubmit} action="" className='flex items-center w-5/6 h-fit '>
                                <input value={textInput} type="text" onChange={ e => setTextInput(e.target.value)} placeholder="Type a message" className="w-full messageInput rounded-xl" />
                                
                                <img src={paperplane} alt="" className="w-5 h-5 mx-5" />
                            </form>
                        </div>
                    </>
                }


            </div>
        </div>
    </>
  )
}

export default ChatMessagesBox