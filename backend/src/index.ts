import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { initializeSocket } from './socket';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3003",
  credentials: true
}));

// JSON Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Routes
app.use('/api', routes);

// Error Handler Middleware
app.use(errorHandler);

// Initialize Socket.IO
const io = initializeSocket(httpServer);

// Port Configuration
const PORT = process.env.PORT || 3008;

// Server Startup
async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to database');
    
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3003"}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});