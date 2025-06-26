import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ExceptionFilter, ValidateRequestBodyPipe } from './error';

export async function createApp<T>(): Promise<INestApplication<T>> {
  const app = await NestFactory.create(AppModule);

  // Enable cookie parser middleware
  app.use(cookieParser());

  // auto validate request body
  app.useGlobalPipes(new ValidateRequestBodyPipe());

  // handle exceptions and return error response to client
  app.useGlobalFilters(new ExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('RESTful API')
    .setDescription('An example of a RESTful API')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  return app;
}
