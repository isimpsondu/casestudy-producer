import { Controller, Post, Body } from "@nestjs/common";
import { ProductService } from "../services/product.service";
import { MessageService } from "../services/message.service";

@Controller("api/product")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly messageService: MessageService
  ) {}

  @Post("processCsvFile")
  async processCsvFile(@Body() body) {
    const result = await this.productService.processCsvFile(
      body.csvFileName,
      "upsert-product",
      "upsert-product-dead-letter"
    );
    if (result[1] != null) {
      throw result[1];
    }
    const events = result[0];
    await Promise.all(
      events.map((event) => this.messageService.send(event[0], event[1]))
    );
    return events;
  }
}
