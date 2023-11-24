import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { SocketModule } from './websocket/events.module';
import { PaymentsController } from './pyments/controllers/payments/payments.controller';
import { ChatModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { UploadsModule } from './getUploads/uploads.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    ProductModule,
    SocketModule,
    ChatModule,
    UploadsModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '/src/uploads'),
      serveStaticOptions: {
        index: false,
      },
    }),
  ],
  controllers: [PaymentsController],
})
export class AppModule {}
