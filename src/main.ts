import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Launch app
  const app = await NestFactory.create(AppModule);

  // Swagger UI
  const config = new DocumentBuilder()
    .setTitle('Atleti Francia API')
    .setDescription('Documentation de l\'API pour Atleti Francia')
    .setVersion('0.0.1')
    // .addBearerAuth() (JWT)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
