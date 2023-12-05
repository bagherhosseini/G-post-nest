import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async myInfo(res: Response, req: any) {
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

      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async getMyFriends(res: Response, req: Request) {
    try {
      const { authToken } = req.cookies;
      const loggedInUserToken = this.jwtService.verify(authToken, {
        secret: process.env.JWT_SECRET,
      });
      const userId = loggedInUserToken.user.id;
      const myFriends = await this.prisma.friends.findMany({
        where: {
          OR: [
            {
              reqSenderId: userId,
            },
            {
              reqReceiverId: userId,
            },
          ],
        },
      });

      const updatedData = myFriends.map((item) => {
        let friendId, friendName;
        if (item.reqSenderId === userId) {
          friendId = item.reqReceiverId;
          friendName = item.reqReceiverName;
        } else if (item.reqReceiverId === userId) {
          friendId = item.reqSenderId;
          friendName = item.reqSenderName;
        }
        delete item.reqSenderId;
        delete item.reqSenderName;
        delete item.reqReceiverId;
        delete item.reqReceiverName;
        return {
          ...item,
          friendId,
          friendName,
        };
      });

      return res.status(200).json(updatedData);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
