import { useState, useEffect, FormEventHandler, useContext } from 'react';
import axiosReq from "../config/axios"
import { getActualTime } from '../utils/getTime';
/*import { socket } from '../utils/useSocket';*/
import { messageInterface } from '../interfaces/message.interface';
import { SocketContext } from '../context/socketContext';

type chatProps = {
    sentBy: string,
    sentTo: string
} 

type userTwo = {
    _id:string,
    name:string,
    email:string,
    phone:string,
    userInfo: string
}

const ChatMessagesBox: React.FC<chatProps> = ({sentBy, sentTo}) => {

    const [ messages, setMessages ] = useState<Array<messageInterface>>([])
    const [ textInput, setTextInput ] = useState('')
    const [ userTwoData, setUserTwoData ] = useState<userTwo>()
    const [ chatId , setChatId ] = useState('')
    const socket = useContext(SocketContext)
    const [isChatSelected, setIsChatSelected] = useState(false)

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



    // selected chat useEffect //
    useEffect(() => {
        getChats()
    }, [sentTo]) 

    // socket useEffect //
    useEffect(() => {
        socket.on('serverMsg', (data) => {
            console.log(data);
            setMessages( messages => [data.msg, ...messages])         
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

  return (
    <div className="w-5/6 h-full border-l border-black/25">
        <div className="flex flex-col w-full h-full ">


            { !isChatSelected && 
                <>
                    <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
                        <img className='w-64' src="../../public/assets/tcsquare1.png" alt="" />
                        <h1 className='text-white text-xl font-semibold'>TypeChat for Windows</h1>
                        <span className='text-white font-normal text-sm'>
                            ¡Selecciona un chat o inicia uno nuevo para comenzar a hablar!
                        </span>
                    </div>
                </>
            }

            { isChatSelected && 
                <>
                    <div className="flex items-center justify-between w-full px-5 py-3 border-b border-black/25">
                        <div className="flex items-center gap-5">
                            <img src="/assets/user.png" alt=""     className="w-12 h-12"/>
                            <span className="font-medium text-white">
                                {userTwoData?.name}
                            </span>
                        </div>

                        <div className="">
                            <img className="w-4 h-4" src="/assets/more.png" alt="" />
                        </div>
                    </div>

                    {/* MESSAGES CONTAINER */}
                    <div className="flex flex-col w-full text-white messageBox ">
                        <div className="flex flex-col-reverse w-full h-full px-32 overflow-y-scroll">
                            { messages?.map( (message, index) => {
                                const msgReceivedClass = 'max-w-md px-3 py-2 mb-2 border w-fit h-fit rounded-xl border-black/25 messageRBgColor'
                                const msgSentClass = 'max-w-md px-3 py-2 mb-2 border w-fit h-fit rounded-xl border-black/25 messageBgColor'
                                let msgIsSent = null
                                if(message.sentBy === userActiveId ) {
                                    msgIsSent = true
                                }
                                
                                return <div key={index} className={ msgIsSent ? msgSentClass : msgReceivedClass}>  
                                    <p className="text-xs w-fit">{message.text} </p>
                                    <span className="relative top-0 left-0 self-end block ml-2 text-end msgTime">{message.date}</span>
                                </div>    
                            })}
                        </div>
                    </div>

                    {/* TEXT INPUT */}
                    <div className="flex items-center justify-between w-full border-t border-black/25 h-14 ">
                        <div className="flex gap-10 px-5 w-fit h-fit">
                            <img src="/assets/happy.png" className="w-5 h-5"/>
                            <img src="/assets/paper-clip.png" className="w-5 h-5" />
                        </div>
                        <form onSubmit={handleSubmit} action="" className='flex items-center w-5/6 h-fit '>
                            <input value={textInput} type="text" onChange={ e => setTextInput(e.target.value)} placeholder="Type a message" className="w-full messageInput rounded-xl" />
                            
                            <img src="/assets/paper-plane.png" alt="" className="w-5 h-5 mx-5" />
                        </form>
                    </div>
                </>
            }


        </div>
    </div>
  )
}

export default ChatMessagesBox