import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum Type {
  Text = 'text',
  File = 'file',
  VoiceCall = 'voiceCall',
  VideoCall = 'videoCall',
}

export class messageDto {
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  messageText: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsEnum(Type)
  @IsNotEmpty()
  messageType: Type;
}

export class getMessageDto {
  @IsString()
  @IsNotEmpty()
  friendId: string;
}
