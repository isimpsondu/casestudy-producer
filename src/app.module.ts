import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./controllers/app.controller";
import { ProductController } from "./controllers/product.controller";
import { AppService } from "./services/app.service";
import { MessageService } from "./services/message.service";
import { CsvFileService } from "./services/csv-file.service";
import { DataServicesModule } from "./services/data-services/data-services.module";
import { ProductServicesModule } from "./services/use-cases/product/product-services.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      dest: "./dist/assets",
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
    DataServicesModule,
    ProductServicesModule,
  ],
  controllers: [AppController, ProductController],
  providers: [AppService, MessageService, CsvFileService],
})
export class AppModule {}
