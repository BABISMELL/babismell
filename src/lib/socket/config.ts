import { SocketConfig } from './types';

export const SOCKET_CONFIG: SocketConfig = {
  url: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  options: {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    timeout: 45000,
    transports: ['polling', 'websocket'],
    path: '/socket.io/',
    withCredentials: true,
    forceNew: true,
    rejectUnauthorized: false
  }
};