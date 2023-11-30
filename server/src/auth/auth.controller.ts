import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Response,
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

  @Post('signUp')
  signUp(@Body() body: signUpType, @Response() res: ResponseEx) {
    return this.authService.signUp(body, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  async signIn(@Body() body: signInType, @Response() res: ResponseEx) {
    return this.authService.signIn(body, res);
  }
}
