import { io } from 'socket.io-client';
import { SOCKET_CONFIG } from './config';
import { SocketMessage, SocketInstance } from './types';

class SocketManager implements SocketInstance {
  private static instance: SocketManager;
  public socket = null;
  private messageQueue: SocketMessage[] = [];
  private reconnectTimer: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  
  private constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      this.socket = io(SOCKET_CONFIG.url, SOCKET_CONFIG.options);
      this.setupListeners();
    } catch (error) {
      console.error('Socket initialization error:', error);
    }
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      this.processMessageQueue();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect' || reason === 'transport close') {
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.handleReconnect();
    });
  }

  private handleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting reconnection...');
      if (!this.socket?.connected) {
        this.socket?.connect();
      }
    }, SOCKET_CONFIG.options.reconnectionDelay);
  }

  private processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message && this.socket?.connected) {
        this.socket.emit(message.event, message.data);
      }
    }
  }

  connect() {
    if (!this.socket?.connected) {
      this.socket?.connect();
    }
  }

  disconnect() {
    if (this.socket?.connected) {
      this.socket.disconnect();
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.messageQueue = [];
    this.listeners.clear();
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)?.add(callback);
    
    if (this.socket) {
      this.socket.on(event, callback as any);
    }

    return () => {
      if (this.socket) {
        this.socket.off(event, callback as any);
      }
      this.listeners.get(event)?.delete(callback);
    };
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      this.messageQueue.push({ event, data });
      this.connect();
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  getSocket() {
    return this.socket;
  }
}

export const socketManager = SocketManager.getInstance();