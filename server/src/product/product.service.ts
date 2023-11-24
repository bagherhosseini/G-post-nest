import { Injectable } from '@nestjs/common';
import { ProductByIdType } from './interface';

type Products = {
  products: [
    {
      id: number;
      title: string;
      price: number;
      description: string;
      img: string;
      createdAt: Date;
      categoryId: number;
      archived: boolean;
      featured: boolean;
      sizeId: number;
      storeId: string;
    },
  ];
};

@Injectable()
export class ProductService {
  constructor() {}

  async getProduct() {
    const res = await fetch(`${process.env.API_URL}/getProduct`);
    const respone: Products = await res.json();
    return respone.products;
  }

  async getProductById(id: ProductByIdType) {
    const res = await fetch(`${process.env.API_URL}/getProductById`, {
      method: 'POST',
      body: JSON.stringify(id),
    });
    const respone: Products = await res.json();
    return respone;
  }
}
