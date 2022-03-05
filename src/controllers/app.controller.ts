import { Controller, Get } from "@nestjs/common";
import { AppService } from "../services/app.service";
import { MessageService } from "../services/message.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly messageService: MessageService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("kafka-test")
  getKafkaTest() {
    return this.messageService.send("kafka.test", { foo: "bar" });
  }

  @Get("product")
  getProduct() {
    return this.messageService.send("product", {
      productId: `test-productId-${new Date().getTime()}`,
      price: 50.0,
      stock: 1000,
    });
  }
}
