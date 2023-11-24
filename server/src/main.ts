import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

async function bootstrap() {
  dotenv.config();
  const httpsOptions = {
    key: fs.readFileSync(`${__dirname}/../src/localhost-key.pem`),
    cert: fs.readFileSync(`${__dirname}/../src/localhost.pem`),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors({
    origin: [process.env.CLIENT_URL],
    // origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3335);
}
bootstrap();
