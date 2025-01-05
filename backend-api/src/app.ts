import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import protect from './middleware/authMiddleware';
import session from 'express-session';
import MongoStore from 'connect-mongo';

// Import routes
import userRoutes from './routes/userRoutes';
import sessionRoutes from './routes/sessionRoutes';
import poolRoutes from './routes/poolRoutes';
// import proofRoutes from './routes/proofRoutes';

dotenv.config();

// Check for required environment variables
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));

// Updated session configuration
app.use(session({
  name: 'siwe-quickstart',
  secret: process.env.SESSION_SECRET || "siwe-quickstart-secret",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true
  }
}));

// Public routes
app.use('/api/users', userRoutes);
    
// Protected routes
// @ts-ignore
app.use('/api/sessions', protect, sessionRoutes);
// @ts-ignore
app.use('/api/pools', protect, poolRoutes);
// app.use('/api/proofs', authMiddleware, proofRoutes);

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

export default app;