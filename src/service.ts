import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import routes from './diplomat/server.js';
import { initializeFirebase } from './diplomat/firebase.js';
import './diplomat/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(routes);

// Initialize Firebase
initializeFirebase();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
