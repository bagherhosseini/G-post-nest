import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { accepFriendType, friendRemoveType, friendType } from './interface';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Friends } from '@prisma/client';

@Injectable()
export class FriendsService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

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
                            status: "success",
                        },
                    ]
                },
            });

            const friends = myFriends.map((item) => {
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

            return res.status(200).json(friends);
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    }

    async addFriend(req: Request, res: Response, body: friendType) {
        try {
            const { authToken } = req.cookies;
            const loggedInUser = this.jwtService.verify(authToken, {
                secret: process.env.JWT_SECRET,
            });
            const reqSenderId = loggedInUser.user.id;
            const reqSenderName = loggedInUser.user.name;

            if (reqSenderId === body.id) {
                return res.status(403).json({ message: 'You cannot add yourself' });
            }

            const reqReceiverId = body.id;
            const reqReceiverName = (await this.prisma.user.findUnique({ where: { id: reqReceiverId } })).name;

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
                return res.status(403).json({ message: 'You have already added this user' });
            }

            const user = await this.prisma.friends.create({
                data: {
                    status: "pending",
                    reqSenderId,
                    reqSenderName,
                    reqReceiverId,
                    reqReceiverName,
                },
            });

            return res.status(200).json({ message: 'You have now added this user', user });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return res.status(403).json({ message: 'You have already added this user' });
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
                            id: friendReqId,
                            reqSenderId: userId,
                        },
                        {
                            id: friendReqId,
                            reqReceiverId: userId,
                        },
                    ],
                },
            });

            if (friend.length === 0) {
                return res.status(403).json({ message: "You're not friend with this user" });
            }

            const removeFriend = await this.prisma.friends.delete({
                where: {
                    id: friendReqId,
                },
            });

            return res.status(200).json({ message: 'You have now removed this user', removeFriend });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return res.status(403).json({ message: 'You have already added this user' });
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
                    id: reqId
                },
            });

            if (!friendReqData) {
                return res.status(403).json({ message: "Friend request not found" });
            }

            if (friendReqData.reqReceiverId !== userId) {
                return res.status(403).json({ message: "You're not allowed to accept this request" });
            }

            if (friendReqData.status !== "pending") {
                if (friendReqData.status === "success") {
                    return res.status(403).json({ message: "You have already accepted this request" });
                }

                return res.status(403).json({ message: "You can not accept this request" });
            }

            const acceptFriend = await this.prisma.friends.update({
                where: {
                    id: reqId,
                },
                data: {
                    status: "success",
                },
            });

            return res.status(200).json({ message: 'You have now accepted this user', acceptFriend });
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
                            status: "pending",
                        },
                    ]
                },
            });

            const updateData = (arr: Array<Friends>, type: string) => arr.map((item) => {
                let friendId, friendName;
                if (type === 'sender') {
                    friendId = item.reqReceiverId;
                    friendName = item.reqReceiverName;
                } else if (type === 'receiver') {
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

            const receivedRedquestsData = requests.filter((item) => item.reqReceiverId === userId);
            const sentRequestsData = requests.filter((item) => item.reqSenderId === userId);

            const receivedRedquests = updateData(receivedRedquestsData, 'receiver');
            const sentRequests = updateData(sentRequestsData, 'sender');

            return res.status(200).json({ receivedRedquests, sentRequests });
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    }

    
}
