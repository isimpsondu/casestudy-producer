import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./controllers/app.controller";
import { ProductController } from "./controllers/product.controller";
import { AppService } from "./services/app.service";
import { MessageService } from "./services/message.service";
import { ProductService } from "./services/product.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: "PRODUCT_PRODUCER",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "product",
            brokers: [process.env.KAFKA_CONNECTION_STRING as string],
          },
          consumer: {
            groupId: "product_producer",
          },
        },
      },
    ]),
  ],
  controllers: [AppController, ProductController],
  providers: [AppService, MessageService, ProductService],
})
export class AppModule {}
