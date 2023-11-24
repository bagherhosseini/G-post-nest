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
import { AuthType } from './interface';
import { Public } from '../public.decorator';
import { ExampleInterceptor } from './example.intercept';
import { Response as ResponseEx } from 'express';

@Public()
@Controller('auth')
@UseInterceptors(new ExampleInterceptor())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() body: AuthType) {
    return this.authService.signUp(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  async signIn(@Body() body: AuthType, @Response() res: ResponseEx) {
    return this.authService.signIn(body, res);
  }
}
