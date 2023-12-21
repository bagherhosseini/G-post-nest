import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import * as fs from 'fs';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const port = process.env.PORT || 8080;
  // const httpsOptions = {
  //   key: fs.readFileSync(`${__dirname}/../src/localhost-key.pem`),
  //   cert: fs.readFileSync(`${__dirname}/../src/localhost.pem`),
  // };
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(process.env.JWT_SECRET));
  app.enableCors({
    origin: ['*'],
    credentials: true,
    exposedHeaders: 'Set-Cookie',
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
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
