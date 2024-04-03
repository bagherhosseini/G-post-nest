import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Response,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { Response as ResponseEx, Request as RequestEx } from 'express';
import { accepFriendType, friendRemoveType, friendType } from './interface';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get('')
  getMyFriends(@Response() res: ResponseEx, @Req() req: RequestEx) {
    return this.friendsService.friends(res, req);
  }

  @Post('add')
  addFriend(
    @Body() body: friendType,
    @Req() req: RequestEx,
    @Response() res: ResponseEx,
  ) {
    return this.friendsService.addFriend(req, res, body);
  }

  @Delete('remove')
  removeFriend(
    @Body() body: friendRemoveType,
    @Req() req: RequestEx,
    @Response() res: ResponseEx,
  ) {
    return this.friendsService.remoeveFriend(req, res, body);
  }

  @Patch('accept')
  acceptFriend(
    @Body() body: accepFriendType,
    @Req() req: RequestEx,
    @Response() res: ResponseEx,
  ) {
    return this.friendsService.acceptFriend(req, res, body);
  }

  @Get('requests')
  friendRequests(@Req() req: RequestEx, @Response() res: ResponseEx) {
    return this.friendsService.friendRequests(req, res);
  }
}
