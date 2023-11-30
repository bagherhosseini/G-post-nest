import { Injectable } from '@nestjs/common';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { signInType, signUpType } from './interface';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(body: signUpType, res: Response) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: body.password,
        },
      });
      delete user.password;

      const payload = { sub: user.id, username: user.email };
      return res
        .status(200)
        .json({ access_token: await this.jwtService.signAsync(payload), user });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return res.status(403).json({ message: 'Email already exists' });
        }
      } else {
        return res.status(500).json({ message: error });
      }
    }
  }

  async signIn(body: signInType, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (user.password !== body.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      delete user.password;

      res.cookie('authToken', user, {
        maxAge: 3600000,
        sameSite: 'none',
        secure: true,
        httpOnly: false,
      });

      return res.status(200).json({
        access_token: await this.signToken(user.id, user.email),
        user,
      });
    } catch (error) {
      return res.status(500).json({ message: error });
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
