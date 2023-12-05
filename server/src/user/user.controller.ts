import { Controller, Get, Req, Response } from '@nestjs/common';
import { UserService } from './user.service';
import { Response as ResponseEx, Request as RequestEx } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('getMyInfo')
  getMyInfo(@Response() res: ResponseEx, @Req() req: any) {
    return this.userService.myInfo(res, req);
  }

  @Get('getMyFriends')
  getMyFriends(@Response() res: ResponseEx, @Req() req: RequestEx) {
    return this.userService.getMyFriends(res, req);
  }
}
