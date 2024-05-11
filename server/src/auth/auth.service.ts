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
          userName: body.userName,
          email: body.email,
          password: body.password,
        },
        select: {
          id: true,
          name: true,
          userName: true,
          email: true,
        },
      });

      const payload = {
        sub: user.id,
        username: user.email,
        userName: user.userName,
      };
      return res.status(200).json({
        access_token: await this.jwtService.signAsync(payload, '5h'),
        user,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const userNameExist = await this.prisma.user.findFirst({
            where: {
              userName: body.userName,
            },
          });

          if (userNameExist) {
            return res
              .status(403)
              .json({ message: 'Username already exists', exist: 'Username' });
          }
          return res
            .status(403)
            .json({ message: 'Email already exists', exist: 'Email' });
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
      const authToken = await this.jwtService.signAsync(payload, '5h');

      res.cookie('authToken', authToken, {
        maxAge: 3600000,
        sameSite: 'none',
        secure: true,
        httpOnly: false,
        // domain: '.bagher.dev',
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
