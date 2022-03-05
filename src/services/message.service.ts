import { Injectable, Inject } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class MessageService {
  constructor(
    @Inject("PRODUCT_PRODUCER") private readonly client: ClientKafka
  ) {}

  async send(queue: string, data: any) {
    return this.client.emit(queue, data);
  }
}
