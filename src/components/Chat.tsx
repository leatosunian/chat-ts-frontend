import { motion } from 'framer-motion';
interface chatProps {
    key:string,
    userId: string,
    profileImage:string,
    name: string,
    lastMsg: string,
    activeChat: string,
    handleClickProp: (e:React.MouseEvent<HTMLDivElement>) => void
}

const Chat: React.FC<chatProps> = (props) => {

    const handleChatStyles = (id: string) => {
        const classes = 'flex items-center gap-4 py-2 rounded-xl px-3 chatContainer cursor-pointer'
        if(id === props.activeChat) {
            return classes + ' selected'
        } else {
            return classes + ' unselected'
        }
    }

  return (
    <motion.div whileTap={{ scale: 0.95 }} transition={{ease: 'easeIn', duration: .05}} onClick={(e) => {props.handleClickProp(e);}} key={props.userId} id={`${props.userId}` } className={ handleChatStyles(props.userId) }>
        <div className="rounded-full sidebarProfileImage">
            {<img src={'http://localhost:4000/api/user/getprofilepic/'+props.profileImage } alt="" className="rounded-full w-11 h-11"/>  }
        </div>
        <div>
            <span className="text-xs font-semibold leading-none text-white">{props.name} </span>
            <p className="text-xs text-white">{props.lastMsg.substring(0, 42)}{props.lastMsg.length >= 42 && '...'} </p>
        </div>
    </motion.div>
  )
}

export default Chat