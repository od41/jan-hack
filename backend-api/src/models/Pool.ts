import mongoose, { Document, Schema } from 'mongoose';

export interface IPool extends Document {
  pool_id: string;        // Maps to on-chain pool ID
  metadata: {
    name: string;
    description: string;
    created_at: Date;
    start_date: Date;
    end_date: Date;
    duration: number;     // in days
  };
  rules: {
    min_distance: number; // in km
    min_steps: number;
    frequency: 'daily' | 'weekly';  // tracking frequency
  };
  status: 'pending' | 'active' | 'completed';
} 