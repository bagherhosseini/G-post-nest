import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './strategy/jwt.constants';
import { AuthGuard } from './strategy/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ExampleMiddeleware } from './middelewares/example.middeleware';
import { CustomJwtService } from './strategy/customJwt.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [AuthController],
  providers: [
    CustomJwtService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExampleMiddeleware).forRoutes({
      path: 'auth/signIn',
      method: RequestMethod.POST,
    });
  }
}
