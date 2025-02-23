// src/index.ts
import express from 'express';

import authRoutes from './routes/authRoute';
import dotenv from 'dotenv';
import { connectToDatabase } from './lib/mongodb';

dotenv.config();

const app = express();
const port = process.env.PORT ;

// Middleware untuk parsing JSON
app.use(express.json());

// Gunakan routes
// app.use('/user', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/auth', authRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectToDatabase();
});