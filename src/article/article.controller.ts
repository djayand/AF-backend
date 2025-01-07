import { Controller, Get, Post, Patch, Delete, Param, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { Article } from '../interfaces/article.interface';

@Controller('articles')
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);

  constructor(private readonly articleService: ArticleService) {}

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
}
