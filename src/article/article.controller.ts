import { Controller, Get, Post, Patch, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger'
import { ArticleService } from './article.service';
import { Article } from '../interfaces/article.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiBody({ type: Article })
  async createArticle(@Body() article: Article): Promise<Article> {
    return this.articleService.create(article);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Article> {
    try {
      console.log(`GET /articles/${id}`);
      return await this.articleService.findOne(id);
    } catch (error) {
      console.error(`Error fetching article with id ${id}:`, error);
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  async findAll(): Promise<Article[]> {
    try {
      console.log('GET /articles');
      return await this.articleService.findAll();
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw new HttpException('Failed to fetch articles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Article>): Promise<Article> {
    try {
      console.log(`PATCH /articles/${id}`, updateData);
      return await this.articleService.update(id, updateData);
    } catch (error) {
      console.error(`Error updating article with id ${id}:`, error);
      throw new HttpException('Failed to update article', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Article> {
    try {
      console.log(`DELETE /articles/${id}`);
      return await this.articleService.delete(id);
    } catch (error) {
      console.error(`Error deleting article with id ${id}:`, error);
      throw new HttpException('Failed to delete article', HttpStatus.BAD_REQUEST);
    }
  }
}