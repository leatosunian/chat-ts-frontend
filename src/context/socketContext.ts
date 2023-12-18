import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../interfaces/socketTypes';
import { createContext } from 'react';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(`${import.meta.env.VITE_BACKEND_URL}/`);
export const SocketContext = createContext(socket);

