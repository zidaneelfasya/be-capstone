// src/index.ts
import express from 'express';
import authRoutes from './routes/authRoute';
import threadRoutes from './routes/threadRoute';
import messageRoutes from './routes/messageRoute';
import chatRoutes from './routes/chatRoute';
import dotenv from 'dotenv';
import { connectToDatabase } from './lib/mongodb';
import cors from "cors"

dotenv.config();

const app = express();
const port = process.env.PORT ;

// Gunakan routes
// app.use('/user', userRoutes);

// Default route

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true, // Allow credentials (e.g., cookies)
  })
);


app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/thread', threadRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/chat', chatRoutes);




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectToDatabase();
});