import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { ArticleModule } from './article/article.module';
import { PlayerModule } from './player/player.module';
import { S3Module } from './s3/s3.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ArticleModule,
    PlayerModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }