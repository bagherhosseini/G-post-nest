import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketDto } from './stocket.dto';

@WebSocketGateway({
  cors: {
    origin: [
      'https://localhost:3000',
      'https://192.168.195.69:3000',
      process.env.CLIENT_URL,
    ],
  },
  secure: true,
})
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<number, string>();

  afterInit() {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    // console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.onlineUsers.forEach((value, key) => {
      if (value === client.id) {
        this.onlineUsers.delete(key);
      }
    });
  }

  @SubscribeMessage('onlineUser')
  handleOnlineUser(client: Socket, data: number) {
    this.onlineUsers.set(data, client.id);
    // this.emitUserStatus(data, 'online');
    client.emit('loggedIn', data);
  }

  @SubscribeMessage('userStatus')
  handleUserStatus(client: Socket, data: any) {
    const userStatus = this.onlineUsers.get(data.userId);
    if (userStatus) {
      client.emit('userStatus', {
        status: 'online',
      });
    } else {
      client.emit('userStatus', {
        status: 'offline',
      });
    }
  }

  // private emitUserStatus(userId: number, status: string) {
  //   this.server.emit('userStatus', {
  //     userId,
  //     status,
  //   });
  // }

  // private updateUserStatus(socketId: string, status: string) {
  //   let userId: number | undefined;
  //   this.onlineUsers.forEach((value, key) => {
  //     if (value === socketId) {
  //       userId = key;
  //       this.onlineUsers.delete(key);
  //     }
  //   });
  //   if (userId) {
  //     this.emitUserStatus(userId, status);
  //   }
  // }

  @SubscribeMessage('sendMessage')
  handleSendMessage(client: Socket, data: SocketDto) {
    const toSocketId = this.onlineUsers.get(data.to);
    if (toSocketId) {
      this.server.to(toSocketId).emit('receiveMessage', {
        from: data.from,
        name: data.name,
        message: data.message,
        type: data.type,
      });
    } else {
      // If recipient's socket ID is not found, send an error message to the sender
      client.emit('receiveMessage', {
        from: 'System',
        name: 'System',
        message: `User with ID ${data.to} is not online.`,
        type: 'text',
      });
    }
  }

  @SubscribeMessage('outGoingCall')
  handeOutgoingCall(client: Socket, data: SocketDto) {
    const toSocketId = this.onlineUsers.get(data.to);
    if (toSocketId && data.signalData) {
      this.server.to(toSocketId).emit('inCommingCall', {
        from: data.from,
        name: data.name,
        isVideoCall: data.isVideoCall,
        signal: data.signalData,
      });
    } else {
      client.emit('receiveMessage', {
        from: 'System',
        name: 'System',
        message: `User with ID ${data.to} is not online.`,
        type: 'text',
      });
    }
  }

  @SubscribeMessage('rejectCall')
  handleRejectCall(client: Socket, data: SocketDto) {
    const toSocketId = this.onlineUsers.get(data.to);
    if (toSocketId) {
      this.server.to(toSocketId).emit('callRejected', {
        from: data.from,
        name: data.name,
        isVideoCall: data.isVideoCall,
      });
    } else {
      client.emit('callRejected', {
        from: 'System',
        name: 'System',
        message: `User with ID ${data.to} is not online.`,
        type: 'text',
      });
    }
  }

  @SubscribeMessage('endCall')
  handleEndCall(client: Socket, data: SocketDto) {
    const toSocketId = this.onlineUsers.get(data.to);
    if (toSocketId) {
      this.server.to(toSocketId).emit('callEnded', {
        from: data.from,
        name: data.name,
        isVideoCall: data.isVideoCall,
      });
    } else {
      client.emit('callEnded', {
        from: 'System',
        name: 'System',
        message: `User with ID ${data.to} is not online.`,
        type: 'text',
      });
    }
  }

  @SubscribeMessage('acceptCall')
  handleAcceptCall(client: Socket, data: SocketDto) {
    const toSocketId = this.onlineUsers.get(data.to);
    if (toSocketId && data.signalData) {
      this.server.to(toSocketId).emit('callAccepted', {
        from: data.from,
        name: data.name,
        isVideoCall: data.isVideoCall,
        signal: data.signalData,
      });
    }
  }
}
