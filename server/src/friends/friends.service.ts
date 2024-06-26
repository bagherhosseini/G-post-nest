import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { accepFriendType, friendAddType, friendRemoveType } from './interface';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Friends } from '@prisma/client';

@Injectable()
export class FriendsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async friends(res: Response, req: Request) {
    try {
      const { authToken } = req.cookies;
      const loggedInUserToken = this.jwtService.verify(authToken, {
        secret: process.env.JWT_SECRET,
      });
      const userId = loggedInUserToken.user.id;
      const myFriends = await this.prisma.friends.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  reqSenderId: userId,
                },
                {
                  reqReceiverId: userId,
                },
              ],
            },
            {
              status: 'success',
            },
          ],
        },
      });

      const friends = myFriends.map((item) => {
        let friendId, friendName, friendUserName;
        if (item.reqSenderId === userId) {
          friendId = item.reqReceiverId;
          friendName = item.reqReceiverName;
          friendUserName = item.reqReceiverUserName;
        } else if (item.reqReceiverId === userId) {
          friendId = item.reqSenderId;
          friendName = item.reqSenderName;
          friendUserName = item.reqSenderUserName;
        }
        delete item.reqSenderId;
        delete item.reqSenderName;
        delete item.reqReceiverId;
        delete item.reqReceiverName;
        delete item.reqReceiverUserName;
        delete item.reqSenderUserName;
        return {
          ...item,
          friendId,
          friendName,
          friendUserName,
        };
      });

      return res.status(200).json(friends);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  async addFriend(req: Request, res: Response, body: friendAddType) {
    try {
      const { authToken } = req.cookies;
      const loggedInUser = this.jwtService.verify(authToken, {
        secret: process.env.JWT_SECRET,
      });
      const reqSenderId = loggedInUser.user.id;
      const reqSenderName = loggedInUser.user.name;
      const reqSenderUserName = loggedInUser.user.userName;

      const reqReceiverUsername = body.friendUserName;

      const receiverData = await this.prisma.user.findFirst({
        where: {
          userName: reqReceiverUsername,
        },
        select: {
          id: true,
        },
      });

      if (!receiverData) {
        return res.status(403).json({ message: 'User not found' });
      }

      if (reqSenderId === receiverData.id) {
        return res.status(403).json({ message: 'You cannot add yourself' });
      }

      const reqReceiverId = receiverData.id;
      const reqReceiverData = await this.prisma.user.findFirst({
        where: {
          id: reqReceiverId,
        },
        select: {
          name: true,
          userName: true,
        },
      });

      if (!reqReceiverData) {
        return res.status(403).json({ message: 'User not found' });
      }

      const reqReceiverName = reqReceiverData.name;
      const reqReceiverUserName = reqReceiverData.userName;

      const friends = await this.prisma.friends.findMany({
        where: {
          OR: [
            {
              reqSenderId,
              reqReceiverId,
            },
            {
              reqSenderId: reqReceiverId,
              reqReceiverId: reqSenderId,
            },
          ],
        },
      });

      if (friends.length > 0) {
        return res
          .status(403)
          .json({ message: 'You have already added this user' });
      }

      const user = await this.prisma.friends.create({
        data: {
          status: 'pending',
          reqSenderId,
          reqSenderName,
          reqSenderUserName,
          reqReceiverId,
          reqReceiverName,
          reqReceiverUserName,
        },
      });

      return res
        .status(200)
        .json({ message: 'You have now added this user', user });
    } catch (error) {
      console.error(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return res
            .status(403)
            .json({ message: 'You have already added this user' });
        } else {
          //here the error could wrong senderId, receiverId or anything wrong with the data
          return res.status(500).json({ message: 'Something went wrong' });
        }
      } else {
        return res.status(500).json({ message: error });
      }
    }
  }

  async remoeveFriend(req: Request, res: Response, body: friendRemoveType) {
    try {
      const { authToken } = req.cookies;
      const loggedInUser = this.jwtService.verify(authToken, {
        secret: process.env.JWT_SECRET,
      });
      const userId = loggedInUser.user.id;
      const friendReqId = body.id;
      if (userId === body.id) {
        return res.status(403).json({ message: 'You cannot remove yourself' });
      }

      const friend = await this.prisma.friends.findMany({
        where: {
          OR: [
            {
              reqSenderId: userId,
              reqReceiverId: friendReqId,
            },
            {
              reqSenderId: friendReqId,
              reqReceiverId: userId,
            },
          ],
        },
      });

      if (friend.length === 0) {
        return res
          .status(403)
          .json({ message: "You're not friend with this user" });
      }

      const friendData = friend[0].id;
      const removeFriend = await this.prisma.friends.delete({
        where: {
          id: friendData,
        },
      });

      return res
        .status(200)
        .json({ message: 'You have now removed this user', removeFriend });
    } catch (error) {
      console.error(error)
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return res
            .status(403)
            .json({ message: 'You have already added this user' });
        } else {
          //here the error could wrong senderId, receiverId or anything wrong with the data
          return res.status(500).json({ message: 'Something went wrong' });
        }
      } else {
        return res.status(500).json({ message: error });
      }
    }
  }

  async acceptFriend(req: Request, res: Response, body: accepFriendType) {
    try {
      const { authToken } = req.cookies;
      const loggedInUser = this.jwtService.verify(authToken, {
        secret: process.env.JWT_SECRET,
      });
      const userId = loggedInUser.user.id;
      const reqId = body.reqId;

      const friendReqData = await this.prisma.friends.findFirst({
        where: {
          id: reqId,
        },
      });

      if (!friendReqData) {
        return res.status(403).json({ message: 'Friend request not found' });
      }

      if (friendReqData.reqReceiverId !== userId) {
        return res
          .status(403)
          .json({ message: "You're not allowed to accept this request" });
      }

      if (friendReqData.status !== 'pending') {
        if (friendReqData.status === 'success') {
          return res
            .status(403)
            .json({ message: 'You have already accepted this request' });
        }

        return res
          .status(403)
          .json({ message: 'You can not accept this request' });
      }

      const acceptFriend = await this.prisma.friends.update({
        where: {
          id: reqId,
        },
        data: {
          status: 'success',
        },
      });

      return res
        .status(200)
        .json({ message: 'You have now accepted this request', acceptFriend });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  async friendRequests(req: Request, res: Response) {
    try {
      const { authToken } = req.cookies;
      const loggedInUserToken = this.jwtService.verify(authToken, {
        secret: process.env.JWT_SECRET,
      });
      const userId = loggedInUserToken.user.id;
      const requests = await this.prisma.friends.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  reqSenderId: userId,
                },
                {
                  reqReceiverId: userId,
                },
              ],
            },
            {
              status: 'pending',
            },
          ],
        },
      });

      const updateData = (arr: Array<Friends>, type: string) =>
        arr.map((item) => {
          let friendId, friendName, friendUserName;
          if (type === 'sender') {
            friendId = item.reqReceiverId;
            friendName = item.reqReceiverName;
            friendUserName = item.reqReceiverUserName;
          } else if (type === 'receiver') {
            friendId = item.reqSenderId;
            friendName = item.reqSenderName;
            friendUserName = item.reqSenderUserName;
          }
          delete item.reqSenderId;
          delete item.reqSenderName;
          delete item.reqReceiverId;
          delete item.reqReceiverName;
          delete item.reqReceiverUserName;
          delete item.reqSenderUserName;
          return {
            ...item,
            friendId,
            friendName,
            friendUserName,
          };
        });

      const receivedRedquestsData = requests.filter(
        (item) => item.reqReceiverId === userId,
      );
      const sentRequestsData = requests.filter(
        (item) => item.reqSenderId === userId,
      );

      const receivedRequests = updateData(receivedRedquestsData, 'receiver');
      const sentRequests = updateData(sentRequestsData, 'sender');

      return res.status(200).json({ receivedRequests, sentRequests, requests });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
