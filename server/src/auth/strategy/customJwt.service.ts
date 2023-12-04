// custom-jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';

@Injectable()
export class CustomJwtService {
  constructor(private readonly jwtService: JwtService) {}

  signAsync(payload: any, expiresIn: string): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn,
    });
  }
}
