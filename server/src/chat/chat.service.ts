import { Injectable } from '@nestjs/common';
import { renameSync } from 'fs';
import path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { getMessageDto, messageDto } from './interface';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async imgStorage(file: Express.Multer.File) {
    try {
      if (file) {
        //get user info (to and from)
        const Newname = path.join(
          __dirname,
          '../../uploads/' +
          Math.floor(
            Math.random() * (1000000000000000 - 100000000000000 + 1) +
            100000000000000,
          ),
        );
        const name = '../uploads/' + file.originalname;
        const oldPath = file.path;
        renameSync(oldPath, Newname);
        return name;
      }
    } catch (err) {
      return err;
    }
  }

  async getMessages(req: Request, res: Response, body: getMessageDto) {
    try {
      const { authToken } = req.cookies;
      const loggedInUser = this.jwtService.verify(authToken, {
        secret: process.env.JWT_SECRET,
      });
      const userId = loggedInUser.user.id;

      const friend = await this.prisma.friends.findFirst({
        where: {
          OR: [
            {
              reqSenderId: userId,
              reqReceiverId: body.friendId,
            },
            {
              reqSenderId: body.friendId,
              reqReceiverId: userId,
            },
          ],
        },
        select: { status: true },
      });

      if (!friend || friend.status !== 'success') {
        return res.status(400).json({ message: 'You are not friends' });
      }

      const messages = await this.prisma.messages.findMany({
        where: {
          OR: [
            {
              senderId: userId,
              receiverId: body.friendId,
            },
            {
              senderId: body.friendId,
              receiverId: userId,
            },
          ],
        },
        orderBy: {
          date: 'asc',
        },
      });

      return res
        .status(200)
        .json(messages);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  async storeMessage(req: Request, res: Response, body: messageDto) {
    try {
      const { authToken } = req.cookies;
      const loggedInUser = this.jwtService.verify(authToken, {
        secret: process.env.JWT_SECRET,
      });
      const userId = loggedInUser.user.id;

      const friend = await this.prisma.friends.findFirst({
        where: {
          OR: [
            {
              reqSenderId: userId,
              reqReceiverId: body.receiverId,
            },
            {
              reqSenderId: body.receiverId,
              reqReceiverId: userId,
            },
          ],
        },
        select: { status: true },
      });

      if (!friend || friend.status !== 'success') {
        return res.status(400).json({ message: 'You are not friends' });
      }

      const message = await this.prisma.messages.create({
        data: {
          senderId: userId,
          receiverId: body.receiverId,
          message: body.messageText,
          type: body.messageType,
        },
      });

      return res
        .status(200)
        .json(message);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
