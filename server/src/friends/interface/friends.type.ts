import { IsNotEmpty, IsString } from 'class-validator';
export class friendType {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class friendRemoveType {
  @IsString()
  @IsNotEmpty()
  id: string;
}