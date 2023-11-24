import { Module } from '@nestjs/common';
import { SocketGateway } from './events.gateway';

@Module({
  providers: [SocketGateway],
})
export class SocketModule {}
