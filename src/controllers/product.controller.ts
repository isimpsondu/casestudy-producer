import { Controller, Post, Body } from "@nestjs/common";
import { ProductService } from "../services/product.service";

@Controller("api/product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("processCsvFile")
  async processCsvFile(@Body() body) {
    return await this.productService.processCsvFile(
      body.csvFileName,
      "create-product",
      "create-product-failed"
    );
  }
}
