import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import * as fs from 'fs';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from "@nestjs/platform-express"

async function bootstrap() {
  const port = process.env.PORT || 8080;
  // const httpsOptions = {
  //   key: fs.readFileSync(`${__dirname}/../src/localhost-key.pem`),
  //   cert: fs.readFileSync(`${__dirname}/../src/localhost.pem`),
  // };
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser(process.env.JWT_SECRET));
  app.set('trust proxy', 1);
  app.enableCors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
    methods: ['GET', 'POST'],
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
