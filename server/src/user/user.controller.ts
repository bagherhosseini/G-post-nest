import { Body, Controller, Get, Post, Req, Response } from '@nestjs/common';
import { UserService } from './user.service';
import { Response as ResponseEx, Request as RequestEx } from 'express';
import { getUserType } from './interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('userInfo')
  users(@Body() body: getUserType, @Response() res: ResponseEx, @Req() req: RequestEx) {
    return this.userService.users(body, res, req);
  }
  
  @Get('myInfo')
  myInfo(@Response() res: ResponseEx, @Req() req: RequestEx) {
    return this.userService.myInfo(res, req);
  }
}
