import 'dotenv/config';

import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import routes from './diplomat/server.js';
import { initializeFirebase } from './diplomat/firebase.js';
import { initializeWebSocket } from './diplomat/socket.js';
import { errorHandler } from './middleware/error.middleware.js';
import './diplomat/db.js';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(routes);

// Error handling middleware (deve ser o último)
app.use(errorHandler);

// Initialize Firebase
initializeFirebase();

// Initialize WebSocket
const io = initializeWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
