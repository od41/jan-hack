import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authMiddleware from './middleware/authMiddleware';

// Import routes
import userRoutes from './routes/userRoutes';
// import sessionRoutes from './routes/sessionRoutes';
// import poolRoutes from './routes/poolRoutes';
// import proofRoutes from './routes/proofRoutes';

dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.mongoSetup();
    this.routes();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private mongoSetup(): void {
    mongoose
      .connect(process.env.MONGODB_URI!)
      .then(() => console.log('Connected to MongoDB'))
      .catch((error) => console.error('MongoDB connection error:', error));
  }

  private routes(): void {
    // Public routes
    this.app.use('/api/users', userRoutes);
    
    // Protected routes
    // this.app.use('/api/sessions', authMiddleware, sessionRoutes);
    // this.app.use('/api/pools', authMiddleware, poolRoutes);
    // this.app.use('/api/proofs', authMiddleware, proofRoutes);
  }
}

export default new App().app;