import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/strategy/auth.guard';
import { UserInfo } from '../User.decorator';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard)
  @Get('info')
  signUp(@UserInfo() user: User, @UserInfo('email') email: string) {
    console.log(email);
    return user;
  }
}
