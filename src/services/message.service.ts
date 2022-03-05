import { Inject } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

export class MessageService {
  constructor(
    @Inject("any_name_i_want") private readonly client: ClientKafka
  ) {}

  async send(topic: string, data: any) {
    return this.client.emit(topic, data);
  }
}
