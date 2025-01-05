import { Schema } from 'mongoose';

export const ArticleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  creator: { type: String, required: true },
  isImportant: { type: Boolean, default: false },
  isDraft: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  coms: { type: Number, default: 0 },
  comments: { type: Array, default: [] },
  keywords: { type: [String], default: [] },
  readingTime: { type: Number, required: true },
});