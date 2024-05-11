import { IsNotEmpty, IsString } from 'class-validator';
export class getUserType {
  @IsString()
  @IsNotEmpty()
  id: string;
}
