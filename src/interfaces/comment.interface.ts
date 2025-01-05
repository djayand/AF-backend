import { Document } from 'mongoose';

export interface Comment extends Document {
  id: string;
  creator: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  replies: Comment[];
}