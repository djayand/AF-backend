import { Document } from 'mongoose';

export class Comment extends Document {
  id: string;
  creator: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  replies: Comment[];
}