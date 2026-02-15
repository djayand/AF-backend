import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from '../interfaces/article.interface';

@Injectable()
export class ArticleService {
  constructor(@InjectModel('Article') private readonly articleModel: Model<Article>) { }

  /**
   * Creates a new article in the database.
   * @param article - The article data to save.
   * @returns The saved article.
   */
  async create(article: Article): Promise<Article> {
    try {
      const newArticle = new this.articleModel(article);
      return await newArticle.save();
    } catch (error) {
      throw new HttpException('Failed to create article', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Finds an article by its ID.
   * @param id - The ID of the article to find.
   * @returns The found article.
   */
  async findOne(id: string): Promise<Article> {
    try {
      const article = await this.articleModel.findById(id).exec();
      if (!article) {
        throw new HttpException(`Article with id ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return article;
    } catch (error) {
      throw new HttpException(`Failed to fetch article with id ${id}`, HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Retrieves all articles from the database.
   * @returns A list of all articles.
   */
  async findAll(): Promise<Article[]> {
    try {
      return await this.articleModel.find().exec();
    } catch (error) {
      throw new HttpException('Failed to fetch articles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Updates an article by its ID.
   * @param id - The ID of the article to update.
   * @param updateData - The data to update the article with.
   * @returns The updated article.
   */
  async update(id: string, updateData: Partial<Article>): Promise<Article> {
    try {
      const updatedArticle = await this.articleModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
      if (!updatedArticle) {
        throw new HttpException(`Article with id ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return updatedArticle;
    } catch (error) {
      throw new HttpException(`Failed to update article with id ${id}`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Deletes an article by its ID.
   * @param id - The ID of the article to delete.
   * @returns The deleted article.
   */
  async delete(id: string): Promise<Article> {
    try {
      const deletedArticle = await this.articleModel.findByIdAndDelete(id).exec();
      if (!deletedArticle) {
        throw new HttpException(`Article with id ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return deletedArticle;
    } catch (error) {
      throw new HttpException(`Failed to delete article with id ${id}`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Increments the view count of an article.
   * @param id - The ID of the article.
   * @returns The updated view count.
   */
  async incrementViews(id: string): Promise<number> {
    try {
      const article = await this.articleModel.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      ).exec();

      if (!article) {
        throw new HttpException(`Article with id ${id} not found`, HttpStatus.NOT_FOUND);
      }

      return article.views;
    } catch (error) {
      throw new HttpException(`Failed to increment views for article ${id}`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Toggles the like count of an article.
   * Currently always increments. TODO: Implement user-specific likes.
   * @param id - The ID of the article.
   * @returns The updated like count.
   */
  async toggleLike(id: string): Promise<number> {
    try {
      const article = await this.articleModel.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true }
      ).exec();

      if (!article) {
        throw new HttpException(`Article with id ${id} not found`, HttpStatus.NOT_FOUND);
      }

      return article.likes;
    } catch (error) {
      throw new HttpException(`Failed to toggle like for article ${id}`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Retrieves the featured article (displayed as hero on homepage).
   * @returns The most recent featured article, or null if none found.
   */
  async findFeatured(): Promise<Article | null> {
    try {
      const featuredArticle = await this.articleModel
        .findOne({ isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(1)
        .exec();

      return featuredArticle;
    } catch (error) {
      throw new HttpException('Failed to fetch featured article', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retrieves the most recent articles.
   * @param limit - Number of articles to retrieve (min: 1, max: 50, default: 10).
   * @returns A list of recent articles, sorted by creation date (newest first).
   */
  async findRecent(limit: number = 10): Promise<Article[]> {
    try {
      const validLimit = Math.min(Math.max(limit, 1), 50);

      return await this.articleModel
        .find()
        .sort({ createdAt: -1 })
        .limit(validLimit)
        .select('-comments')
        .exec();
    } catch (error) {
      throw new HttpException('Failed to fetch recent articles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retrieves articles containing ALL specified keywords.
   * @param keywords - Array of keywords that must all be present in the article.
   * @param limit - Number of articles to retrieve (min: 1, max: 50, default: 10).
   * @returns A list of articles matching all keywords, sorted by creation date (newest first).
   */
  async findByKeywords(keywords: string[], limit: number = 10): Promise<Article[]> {
    try {
      if (!keywords || keywords.length === 0) {
        throw new HttpException('At least one keyword is required', HttpStatus.BAD_REQUEST);
      }

      const validLimit = Math.min(Math.max(limit, 1), 50);

      return await this.articleModel
        .find({ keywords: { $all: keywords } })
        .sort({ createdAt: -1 })
        .limit(validLimit)
        .select('-comments')
        .exec();
    } catch (error) {
      throw new HttpException('Failed to fetch articles by keywords', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}