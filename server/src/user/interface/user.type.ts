import { IsNotEmpty, IsString } from 'class-validator';
export class getUserType {
  @IsString()
  @IsNotEmpty()
  userName: string;
}
