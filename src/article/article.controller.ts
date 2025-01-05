import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './interfaces/article.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() article: Article): Promise<Article> {
    return this.articleService.create(article);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Article> {
    return this.articleService.findOne(id);
  }

  @Get()
  findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<Article>): Promise<Article> {
    return this.articleService.update(id, updateData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Article> {
    return this.articleService.delete(id);
  }
}
