import mongoose, { Schema, Document } from 'mongoose';

export interface ITripMemory extends Document {
  userId: mongoose.Types.ObjectId;
  destination?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
  budget?: number;
  currency?: string;
  travelers?: number;
  travelStyle?: string;
  transportation?: string;
  accommodation?: string;
  interests?: string[];
  updatedAt: Date;
}

const TripMemorySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    destination: String,
    startDate: String,
    endDate: String,
    duration: Number,
    budget: Number,
    currency: { type: String, default: 'USD' },
    travelers: Number,
    travelStyle: String,
    transportation: String,
    accommodation: String,
    interests: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.TripMemory ||
  mongoose.model<ITripMemory>('TripMemory', TripMemorySchema);
