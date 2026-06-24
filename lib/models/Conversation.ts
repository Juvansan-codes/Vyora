import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
  }[];
  memory: {
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
  };
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const MemorySchema = new Schema(
  {
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
  { _id: false }
);

const ConversationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Trip Chat',
      maxlength: 200,
    },
    messages: [MessageSchema],
    memory: {
      type: MemorySchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient user-based queries sorted by recency
ConversationSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', ConversationSchema);
