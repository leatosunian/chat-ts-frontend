import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../interfaces/socketTypes';
import { createContext } from 'react';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:4000/");

export const SocketContext = createContext(socket);

