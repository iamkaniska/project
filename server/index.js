import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import questionRoutes from './routes/questions.js';
import interviewRoutes from './routes/interviews.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/interviews', interviewRoutes); //qwertyu

// MongoDB Connection
mongoose.connect('mongodb+srv://kaniskamaity:2jS86kwVDdxjCJKZ@cluster0.f3vcv.mongodb.net/')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
console.log(process.env.JWT_SECRET);

app.get('/', (req, res) => {
  res.send('Interview Preparation API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});