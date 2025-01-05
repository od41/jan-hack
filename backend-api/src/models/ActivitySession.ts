import mongoose, { Document, Schema } from 'mongoose';

export interface IActivitySession extends Document {
  user_id: string;
  group_id: string;
  start_time: Date;
  end_time?: Date;
  activity_status: 'active' | 'completed' | 'cancelled';
  movement_data: {
    distance: number;
    steps: number;
    gps_logs: Array<{
      lat: number;
      lon: number;
      timestamp: Date;
    }>;
  };
  proof_hash?: string;
}

const ActivitySessionSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  group_id: {
    type: String,
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
    default: Date.now,
  },
  end_time: Date,
  activity_status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  movement_data: {
    distance: {
      type: Number,
      default: 0,
    },
    steps: {
      type: Number,
      default: 0,
    },
    gps_logs: [{
      lat: Number,
      lon: Number,
      timestamp: Date,
    }],
  },
  proof_hash: String,
});

export default mongoose.model<IActivitySession>('ActivitySession', ActivitySessionSchema); 