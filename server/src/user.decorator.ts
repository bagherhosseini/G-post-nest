import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface AuthenticatedRequest extends Express.Request {
  user: {
    userId: string;
    email: string;
  };
}

export const UserInfo = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: AuthenticatedRequest = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
