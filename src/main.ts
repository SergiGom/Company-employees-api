import { ValidationPipe } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';

import { HttpExceptionFilter } from './presentation/filters/http-exception.filter';

import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );

  const config = new DocumentBuilder()
    .setTitle('Company Employees API')
    .setDescription('API con Onion Architecture')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    config,
  );

  SwaggerModule.setup(
    'swagger',
    app,
    document,
  );

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`Application running on port ${port}`);
}

bootstrap();

