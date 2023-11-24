import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SocketDto {
  @IsNumber()
  @IsNotEmpty()
  from: number;

  @IsNumber()
  @IsNotEmpty()
  to: number;

  @IsString()
  @IsNotEmpty()
  message?: string;

  @IsString()
  @IsNotEmpty()
  type?: string;

  @IsNumber()
  @IsNotEmpty()
  roomId?: number;

  @IsString()
  @IsNotEmpty()
  callType?: string;

  @IsBoolean()
  @IsNotEmpty()
  isVideoCall?: boolean;

  @IsNotEmpty()
  signalData?: any;

  @IsString()
  @IsNotEmpty()
  name?: string;
}
