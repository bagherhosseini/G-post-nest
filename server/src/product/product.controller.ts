import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Public } from '../public.decorator';
import { AuthGuard } from '../auth/strategy/auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Public()
  @Get('getProduct')
  getProduct() {
    return this.productService.getProduct();
  }

  @UseGuards(AuthGuard)
  @Post('getProductById/:productId')
  getProductById(
    @Req() req: AuthenticatedRequest,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    console.log({ user: req.user });
    return this.productService.getProductById({
      productId: productId,
    });
  }
}
