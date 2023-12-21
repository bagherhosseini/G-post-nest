import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
// import * as fs from 'fs';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  dotenv.config();
  const port = process.env.PORT || 8080;
  // const httpsOptions = {
  //   key: fs.readFileSync(`${__dirname}/../src/localhost-key.pem`),
  //   cert: fs.readFileSync(`${__dirname}/../src/localhost.pem`),
  // };
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
    exposedHeaders: 'Set-Cookie',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Content-Type',
      'Authorization',
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(port);
}
bootstrap();
