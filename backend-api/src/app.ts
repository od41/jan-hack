import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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
    this.app.get('/', (req: Request, res: Response) => {
      res.json({ message: 'Welcome to the API' });
    });
  }
}

export default new App().app;