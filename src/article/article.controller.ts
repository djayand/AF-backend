import { Controller, Get, Post, Patch, Delete, Put, Param, Body, Query, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { Article } from '../interfaces/article.interface';

@Controller('articles')
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);

  constructor(private readonly articleService: ArticleService) { }

  /**
   * Creates a new article.
   * POST /articles
   */
  @Post()
  @ApiBody({ type: Article })
  async createArticle(@Body() article: Article): Promise<Article> {
    try {
      this.logger.log('POST /articles');
      const createdArticle = await this.articleService.create(article);
      this.logger.log(`Article created with ID: ${createdArticle._id}`);
      return createdArticle;
    } catch (error) {
      this.logger.error('Error creating article:', error.stack);
      throw new HttpException('Failed to create article', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retrieves the featured article (for homepage hero section).
   * GET /articles/featured
   */
  @Get('featured')
  async findFeatured(): Promise<Article> {
    try {
      this.logger.log('GET /articles/featured');
      const article = await this.articleService.findFeatured();

      if (!article) {
        this.logger.warn('No featured article found');
        throw new HttpException('No featured article found', HttpStatus.NOT_FOUND);
      }

      return article;
    } catch (error) {
      this.logger.error('Error fetching featured article:', error.stack);
      throw error;
    }
  }

  /**
   * Retrieves recent articles.
   * GET /articles/recent?limit=6
   */
  @Get('recent')
  async findRecent(@Query('limit') limit?: string): Promise<Article[]> {
    try {
      const parsedLimit = limit ? parseInt(limit, 10) : 10;
      this.logger.log(`GET /articles/recent?limit=${parsedLimit}`);

      return await this.articleService.findRecent(parsedLimit);
    } catch (error) {
      this.logger.error('Error fetching recent articles:', error.stack);
      throw new HttpException('Failed to fetch recent articles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retrieves articles by keywords.
   * GET /articles/by-keywords?keywords=Mercato,Rumeurs&limit=8
   */
  @Get('by-keywords')
  async findByKeywords(
    @Query('keywords') keywordsParam?: string,
    @Query('limit') limitParam?: string
  ): Promise<{ count: number; keywords: string[]; articles: Article[] }> {
    try {
      if (!keywordsParam) {
        this.logger.warn('GET /articles/by-keywords called without keywords parameter');
        throw new HttpException(
          'Parameter "keywords" is required. Example: /articles/by-keywords?keywords=Mercato,Rumeurs',
          HttpStatus.BAD_REQUEST
        );
      }

      const keywords = keywordsParam
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      if (keywords.length === 0) {
        throw new HttpException('At least one valid keyword is required', HttpStatus.BAD_REQUEST);
      }

      const limit = limitParam ? parseInt(limitParam, 10) : 10;

      this.logger.log(`GET /articles/by-keywords?keywords=${keywordsParam}&limit=${limit}`);

      const articles = await this.articleService.findByKeywords(keywords, limit);

      return {
        count: articles.length,
        keywords: keywords,
        articles: articles
      };
    } catch (error) {
      this.logger.error('Error fetching articles by keywords:', error.stack);
      throw error;
    }
  }

  /**
   * Retrieves a single article by ID.
   * GET /articles/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Article> {
    try {
      this.logger.log(`GET /articles/${id}`);
      return await this.articleService.findOne(id);
    } catch (error) {
      this.logger.error(`Error fetching article with id ${id}:`, error.stack);
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Retrieves all articles.
   * GET /articles
   */
  @Get()
  async findAll(): Promise<Article[]> {
    try {
      this.logger.log('GET /articles');
      return await this.articleService.findAll();
    } catch (error) {
      this.logger.error('Error fetching articles:', error.stack);
      throw new HttpException('Failed to fetch articles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Updates an article by ID.
   * PATCH /articles/:id
   */
  @Patch(':id')
  @ApiBody({ type: Article })
  async update(@Param('id') id: string, @Body() updateData: Partial<Article>): Promise<Article> {
    try {
      this.logger.log(`PATCH /articles/${id}`);
      return await this.articleService.update(id, updateData);
    } catch (error) {
      this.logger.error(`Error updating article with id ${id}:`, error.stack);
      throw new HttpException('Failed to update article', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Deletes an article by ID.
   * DELETE /articles/:id
   */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Article> {
    try {
      this.logger.log(`DELETE /articles/${id}`);
      return await this.articleService.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting article with id ${id}:`, error.stack);
      throw new HttpException('Failed to delete article', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Increments the view count of an article.
   * PUT /articles/:id/views
   */
  @Put(':id/views')
  async incrementViews(@Param('id') id: string): Promise<{ views: number }> {
    try {
      this.logger.log(`PUT /articles/${id}/views`);
      const views = await this.articleService.incrementViews(id);
      return { views };
    } catch (error) {
      this.logger.error(`Error incrementing views for article ${id}:`, error.stack);
      throw new HttpException('Failed to increment views', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Toggles the like status of an article.
   * PUT /articles/:id/like
   */
  @Put(':id/like')
  async toggleLike(@Param('id') id: string): Promise<{ likes: number }> {
    try {
      this.logger.log(`PUT /articles/${id}/like`);
      const likes = await this.articleService.toggleLike(id);
      return { likes };
    } catch (error) {
      this.logger.error(`Error toggling like for article ${id}:`, error.stack);
      throw new HttpException('Failed to toggle like', HttpStatus.BAD_REQUEST);
    }
  }
}