import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ index: true, required: true, unique: true })
  productId: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  updatedAt: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
