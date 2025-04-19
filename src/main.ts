import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 4001;
  const host = process.env.HOST || 'localhost'; // Default to IPv4 localhost
  await app.listen(port, host);
  console.log(
    `Application is running on: http://${host}:${port}/graphql`,
  );
}
bootstrap();
