import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
@Public()
@Controller('chat')
export class ChatController {
  // constructor(private authService: AuthService) {}
  @Post('send')
  @UseInterceptors(FileInterceptor('file'))
  fileUploadChatt(@UploadedFile() file: Express.Multer.File) {
    return { file: `uploads/${file.filename}`, type: 'file' };
  }
}
