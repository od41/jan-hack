import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
  group_id: string;        // Maps to on-chain pool ID
  metadata: {
    name: string;
    description: string;
    created_at: Date;
  };
  rules: {
    min_stake: number;
    max_number: number;
    frequency: 'daily' | 'weekly' | 'monthly';  // tracking frequency
    min_distance: number; // in km
    min_steps: number;
  };
  status: 'pending' | 'active' | 'completed';
}

const GroupSchema = new Schema({
  group_id: {
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
    }
  },
  rules: {
    min_stake: {
      type: Number,
      required: true
    },
    max_members: {
      type: Number,
      required: true
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: true
    },
    min_distance: {
      type: Number,
      required: true
    },
    min_steps: {
      type: Number,
      required: true
    },
    
    
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed'],
    default: 'pending'
  }
});

export default mongoose.model<IGroup>('Group', GroupSchema);