import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDataServices } from '../../../core';
import { MongoGenericRepository } from './mongo-generic-repository';
import {
  Product,
  ProductDocument,
} from './model';

@Injectable()
export class MongoDataServices
  implements IDataServices, OnApplicationBootstrap
{
  products: MongoGenericRepository<Product>;

  constructor(
    @InjectModel(Product.name)
    private ProductRepository: Model<ProductDocument>,
  ) {}

  onApplicationBootstrap() {
    this.products = new MongoGenericRepository<Product>(this.ProductRepository);
  }
}
