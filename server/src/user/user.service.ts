import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { getUserType } from './interface';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async myInfo(res: Response, req: Request) {
    try {
      const { authToken } = req.cookies;

      const loggedInUserToken = this.jwtService.verify(authToken, {
        secret: process.env.JWT_SECRET,
      });

      if (!authToken) {
        return res.status(401).json({ message: 'Token not found' });
      }

      if (!loggedInUserToken) {
        return res.status(401).json({ message: 'Token not found' });
      }

      const user = await this.prisma.user.findFirst({
        where: {
          id: loggedInUserToken.user.id,
        },
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      delete user.password;

      return res.status(200).json({ user, authToken });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async users(body: getUserType, res: Response, req: Request) {
    try {
      const { userName } = body;
      const { authToken } = req.cookies;

      const loggedInUserToken = this.jwtService.verify(authToken, {
        secret: process.env.JWT_SECRET,
      });

      if (!authToken) {
        return res.status(401).json({ message: 'Token not found' });
      }

      if (!loggedInUserToken) {
        return res.status(401).json({ message: 'Token not found' });
      }

      const user = await this.prisma.user.findMany({
        where: {
          id: {
            not: loggedInUserToken.user.id,
          },
          userName
        },
        select: {
          id: true,
          name: true,
          userName: true,
        },
      });

      return res.status(200).json({user});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }
}
