import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'articles' })
export class Article extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  coverImage: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ required: true })
  creator: string;

  @Prop({ default: false })
  isImportant: boolean;

  @Prop({ default: true })
  isDraft: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  coms: number;

  @Prop({ default: [] })
  comments: any[];

  @Prop({ default: [] })
  keywords: string[];

  @Prop({ required: true })
  readingTime: number;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);