import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthType {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
