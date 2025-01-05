import { Document } from 'mongoose';
import { Comment } from './comment.interface';

export interface Article extends Document {
  id: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  createdAt: Date;
  updatedAt: Date;
  creator: string;
  isImportant: boolean;
  isDraft: boolean;
  isFeatured: boolean;
  views: number;
  likes: number;
  coms: number;
  comments: Comment[];
  keywords: string[];
  readingTime: number;
}