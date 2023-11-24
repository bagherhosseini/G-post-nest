import { Injectable } from '@nestjs/common';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthType } from './interface';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signUp(body: AuthType) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
        },
      });
      delete user.password;

      const payload = { sub: user.id, username: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
        message: user,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return { message: 'Email already exists' };
        }
      }
      return { message: 'Error' };
    }
  }
  async signIn(body: AuthType, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });

      if (!user) {
        return { message: 'User not found' };
      }
      // return (await this.signToken(user.id, user.email)).access_token;

      res.cookie('authToken', 'asjkdhaksdhkj', {
        // Expires: new Date('9999-12-31'),
        maxAge: 3600000,
        sameSite: 'none',
        // Secure är just nu buggat för Postman, använd inte secure: true för Postman.
        secure: true,
        httpOnly: false,
      });
      console.log(res);
      return res.json(await this.signToken(user.id, user.email)).status(200);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return { message: 'Prisma error' };
      }
      return { message: 'Error' };
    }
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = 'F84C38585A7A74E8F85BB8111BDE2';

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
