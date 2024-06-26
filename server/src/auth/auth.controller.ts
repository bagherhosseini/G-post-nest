import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Response,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInType, signUpType } from './interface';
import { Public } from '../public.decorator';
import { ExampleInterceptor } from './example.intercept';
import { Response as ResponseEx } from 'express';

@Public()
@Controller('auth')
@UseInterceptors(new ExampleInterceptor())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signUp')
  signUp(@Body() body: signUpType, @Response() res: ResponseEx) {
    return this.authService.signUp(body, res);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  async signIn(@Body() body: signInType, @Response() res: ResponseEx) {
    return this.authService.signIn(body, res);
  }

  @Get('removeCookie')
  removeCookie(@Res() res: ResponseEx) {
    res.clearCookie('authToken');
    return res.status(200).json('Cookie removed');
  }
}
