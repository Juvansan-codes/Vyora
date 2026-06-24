// === Chat Message ===
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// === Trip Memory (extracted travel context) ===
export interface TripMemory {
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
}

// === Conversation (full chat session) ===
export interface Conversation {
  _id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  memory: TripMemory;
  createdAt: string;
  updatedAt: string;
}

// === Conversation summary for sidebar listing ===
export interface ConversationSummary {
  _id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
}

// === API Request/Response types ===
export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatStreamChunk {
  type: 'token' | 'done' | 'error' | 'memory_update';
  content?: string;
  conversationId?: string;
  memory?: TripMemory;
  error?: string;
}

export interface MemoryUpdateRequest {
  memory: Partial<TripMemory>;
}
