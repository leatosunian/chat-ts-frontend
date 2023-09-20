import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../interfaces/socketTypes';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:4000/");

