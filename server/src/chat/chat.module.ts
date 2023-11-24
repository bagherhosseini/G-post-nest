import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MulterModule } from '@nestjs/platform-express';
import { ChatController } from './chat.controller';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './src/uploads', // Change to your desired destination folder
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  ],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
