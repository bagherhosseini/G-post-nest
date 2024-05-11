import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  Response,
  Body,
} from '@nestjs/common';
import { Response as ResponseEx, Request as RequestEx } from 'express';

// import { Public } from '../public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatService } from './chat.service';
import { getMessageDto, messageDto } from './interface';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  // @Public()
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  fileUploadChatt(@UploadedFile() file: Express.Multer.File) {
    return { file: `uploads/${file.filename}`, type: 'file' };
  }

  @Post('messages')
  getMessages(
    @Body() body: getMessageDto,
    @Req() req: RequestEx,
    @Response() res: ResponseEx,
  ) {
    return this.chatService.getMessages(req, res, body);
  }

  @Post('message')
  storeMessage(
    @Body() body: messageDto,
    @Req() req: RequestEx,
    @Response() res: ResponseEx,
  ) {
    return this.chatService.storeMessage(req, res, body);
  }
}
