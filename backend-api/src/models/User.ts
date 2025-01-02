import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  wallet_address: string;
  profile: {
    name?: string;
    username?: string;
    email?: string;
  };
  created_at: Date;
}

const UserSchema = new Schema({
  wallet_address: {
    type: String,
    required: true,
    unique: true,
  },
  profile: {
    name: String,
    username: String,
    email: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IUser>('User', UserSchema);