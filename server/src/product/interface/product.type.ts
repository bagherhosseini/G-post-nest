import { IsNotEmpty, IsNumber } from 'class-validator';

export class ProductByIdType {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
