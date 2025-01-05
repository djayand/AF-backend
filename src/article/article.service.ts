import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './interfaces/article.interface';

@Injectable()
export class ArticleService {
  constructor(@InjectModel('Article') private readonly articleModel: Model<Article>) {}

  async create(article: Article): Promise<Article> {
    const newArticle = new this.articleModel(article);
    return newArticle.save();
  }

  async findOne(id: string): Promise<Article> {
    return this.articleModel.findById(id).exec();
  }

  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  async update(id: string, updateData: Partial<Article>): Promise<Article> {
    return this.articleModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<Article> {
    return this.articleModel.findByIdAndDelete(id).exec();
  }
}