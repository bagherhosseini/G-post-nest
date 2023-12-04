import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SocketModule } from './websocket/events.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { UploadsModule } from './getUploads/uploads.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    ChatModule,
    PrismaModule,
    SocketModule,
    UploadsModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '/src/uploads'),
      serveStaticOptions: {
        index: false,
      },
    }),
    UserModule,
  ],
  controllers: [],
})
export class AppModule {}
