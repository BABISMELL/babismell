import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export function initializeSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3003",
      methods: ["GET", "POST"],
      credentials: true
    },
    path: '/socket.io'
  });

  // Connection handling
  io.on('connection', (socket) => {
    try {
      console.log('Client connected:', socket.id);

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    } catch (error) {
      console.error('Error in socket connection:', error);
    }
  });

  return io;
}