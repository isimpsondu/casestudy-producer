import { Injectable } from '@nestjs/common';
import { Product } from '../../../core/entities';
import { IDataServices } from '../../../core/abstracts';

@Injectable()
export class ProductService {
  constructor(
    private dataServices: IDataServices,
  ) {}

  getAllProducts(): Promise<Product[]> {
    return this.dataServices.products.getAll();
  }
}
