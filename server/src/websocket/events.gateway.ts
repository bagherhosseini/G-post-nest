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
    origin: [process.env.CLIENT_URL],
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
    // console.log(`Client disconnected: ${client.id}`);
    // Remove disconnected user from onlineUsers map
    this.onlineUsers.forEach((value, key) => {
      if (value === client.id) {
        this.onlineUsers.delete(key);
      }
    });
    // You can perform disconnection-related logic here
  }

  @SubscribeMessage('onlineUser')
  handleOnlineUser(client: Socket, data: number) {
    // Store the client's random ID and the socket ID in the onlineUsers map
    this.onlineUsers.set(data, client.id);
    // Send back the user's random ID to the client using the 'loggedIn' event
    client.emit('loggedIn', data);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(client: Socket, data: SocketDto) {
    const toSocketId = this.onlineUsers.get(data.to);
    if (toSocketId) {
      this.server.to(toSocketId).emit('receiveMessage', {
        from: data.from,
        message: data.message,
        type: data.type,
      });
    } else {
      // If recipient's socket ID is not found, send an error message to the sender
      client.emit('receiveMessage', {
        from: 'System',
        message: `User with ID ${data.to} is not online.`,
        type: 'text',
      });
    }
  }

  @SubscribeMessage('outGoingCall')
  handeOutgoingCall(client: Socket, data: SocketDto) {
    const toSocketId = this.onlineUsers.get(data.to);
    if (toSocketId && data.signalData) {
      // If recipient's socket ID is found, emit the message to that socket
      this.server.to(toSocketId).emit('inCommingCall', {
        from: data.from,
        message: data.message,
        roomId: data.roomId,
        type: data.type,
        isVideoCall: data.isVideoCall,
        signal: data.signalData,
        name: data.name,
      });
    } else {
      // If recipient's socket ID is not found, send an error message to the sender
      client.emit('receiveMessage', {
        from: 'System',
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
        roomId: data.roomId,
        callType: data.callType,
      });
    } else {
      client.emit('callError', {
        message: `User with ID ${data.roomId} is not online.`,
      });
    }
  }

  @SubscribeMessage('endCall')
  handleEndCall(client: Socket, data: SocketDto) {
    const toSocketId = this.onlineUsers.get(data.to);
    if (toSocketId) {
      this.server.to(toSocketId).emit('callEnded', {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    } else {
      client.emit('callError', {
        message: `User with ID ${data.roomId} is not online.`,
      });
    }
  }

  @SubscribeMessage('acceptCall')
  handleAcceptCall(client: Socket, data: SocketDto) {
    const toSocketId = this.onlineUsers.get(data.to);
    if (toSocketId && data.signalData) {
      this.server.to(toSocketId).emit('callAccepted', {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
        signal: data.signalData,
      });
    }
  }

  @SubscribeMessage('offer')
  handleOffer(client: Socket, data: { to: number; offer: any }) {
    const toSocketId = this.onlineUsers.get(data.to);
    if (toSocketId) {
      // If recipient's socket is found, send the offer
      this.server
        .to(toSocketId)
        .emit('offer', { from: data.to, offer: data.offer });
    } else {
      // If recipient's socket is not found, handle the error
      client.emit('errorMessage', {
        message: `User with ID ${data.to} is not online.`,
      });
    }
  }

  @SubscribeMessage('answer')
  handleAnswer(client: Socket, data: { to: number; answer: any }) {
    const toSocketId = this.onlineUsers.get(data.to);
    if (toSocketId) {
      // If recipient's socket is found, send the answer
      this.server
        .to(toSocketId)
        .emit('answer', { from: data.to, answer: data.answer });
    } else {
      // If recipient's socket is not found, handle the error
      client.emit('errorMessage', {
        message: `User with ID ${data.to} is not online.`,
      });
    }
  }

  @SubscribeMessage('iceCandidate')
  handleIceCandidate(client: Socket, data: { to: number; candidate: any }) {
    const toSocketId = this.onlineUsers.get(data.to);
    if (toSocketId) {
      // If recipient's socket is found, send the ICE candidate
      this.server.to(toSocketId).emit('iceCandidate', {
        from: data.to,
        candidate: data.candidate,
      });
    } else {
      // If recipient's socket is not found, handle the error
      client.emit('errorMessage', {
        message: `User with ID ${data.to} is not online.`,
      });
    }
  }
}
