import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { errorMiddleware } from './middleware/error';
import routes from './routes';

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});