import { IsNotEmpty, IsString } from 'class-validator';
export class friendType {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class friendAddType {
  @IsString()
  @IsNotEmpty()
  friendUserName: string;
}

export class friendRemoveType {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class accepFriendType {
  @IsString()
  @IsNotEmpty()
  reqId: string;
}
