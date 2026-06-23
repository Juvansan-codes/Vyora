export interface Trip {
  _id: string;
  destination: string;
  description?: string;
  status: 'planning' | 'booked' | 'completed';
  createdAt: string;
  updatedAt: string;
}
