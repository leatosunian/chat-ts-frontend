import { messageInterface } from "./message.interface";

export interface ServerToClientEvents {
    serverMsg: (data: { msg: messageInterface; room: string}) => void
    serverNewChatCreated: (roomUsers: {userOne: string|null; userTwo:string}) => void
    incomingMsgNotification: (data: { msg: messageInterface; room: string }) => void
}

export interface ClientToServerEvents {
    joinRoom: (room: string) => void
    clientMsg: (data: { msg: messageInterface; room: string}) => void   
    clientNewChatCreated: (roomUsers: {userOne: string|null; userTwo:string}) => void
}