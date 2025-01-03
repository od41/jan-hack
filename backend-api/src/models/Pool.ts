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
    frequency: 'daily' | 'weekly' | 'monthly';  // tracking frequency
  };
  status: 'pending' | 'active' | 'completed';
}

const PoolSchema = new Schema({
  pool_id: {
    type: String,
    required: true,
    unique: true
  },
  metadata: {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    },
    duration: {
      type: Number,
      required: true
    }
  },
  rules: {
    min_distance: {
      type: Number,
      required: true
    },
    min_steps: {
      type: Number,
      required: true
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly'],
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed'],
    default: 'pending'
  }
});

export default mongoose.model<IPool>('Pool', PoolSchema);