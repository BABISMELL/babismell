import { Socket } from 'socket.io-client';

export interface SocketMessage {
  event: string;
  data: any;
}

export interface SocketInstance {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
  on: (event: string, callback: Function) => () => void;
  emit: (event: string, data: any) => void;
  isConnected: () => boolean;
  getSocket: () => Socket | null;
}

export interface SocketConfig {
  url: string;
  options: {
    autoConnect: boolean;
    reconnection: boolean;
    reconnectionAttempts: number;
    reconnectionDelay: number;
    timeout: number;
    transports: string[];
    path: string;
    withCredentials: boolean;
    forceNew: boolean;
  };
}