// src/index.ts
import express from 'express';
import authRoutes from './routes/authRoutes';
import threadRoutes from './routes/threadRoutes';
import dotenv from 'dotenv';
import { connectToDatabase } from './lib/mongodb';

dotenv.config();

const app = express();
const port = process.env.PORT ;

// Gunakan routes
// app.use('/user', userRoutes);

// Default route
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/thread', threadRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectToDatabase();
});