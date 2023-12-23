import { Injectable } from '@nestjs/common';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { signInType, signUpType } from './interface';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import { CustomJwtService } from './strategy/customJwt.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: CustomJwtService,
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
      return res.status(200).json({
        access_token: await this.jwtService.signAsync(payload, '1h'),
        user,
      });
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

      const payload = { user };
      const authToken = await this.jwtService.signAsync(payload, '1h');

      res.cookie('authToken', authToken, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
      });

      return res.status(200).json({
        access_token: await this.jwtService.signAsync(payload, '1h'),
        user,
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
