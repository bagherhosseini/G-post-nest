import { Controller, Get, Req, Response } from '@nestjs/common';
import { UserService } from './user.service';
import { Response as ResponseEx, Request as RequestEx } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('myInfo')
  myInfo(@Response() res: ResponseEx, @Req() req: any) {
    return this.userService.myInfo(res, req);
  }
}
