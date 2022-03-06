import { Test, TestingModule } from "@nestjs/testing";
import { ProductController } from "./product.controller";
import { CsvFileService } from "../services/csv-file.service";
import { MessageService } from "../services/message.service";
import { ProductService } from "../services/use-cases/product";

class MessageServiceMock {
  async send(queue: string, data: any) {
    return null;
  }
}

class ProductServiceMock {}

describe("ProductController", () => {
  let productController: ProductController;

  beforeEach(async () => {
    const MessageServiceProvider = {
      provide: MessageService,
      useClass: MessageServiceMock,
    };

    const ProductServiceProvider = {
      provide: ProductService,
      useClass: ProductServiceMock,
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [CsvFileService, MessageServiceProvider, ProductServiceProvider],
    }).compile();

    productController = app.get<ProductController>(ProductController);
  });

  describe("processCsvFile", () => {
    it("should publish events in data queue when data is all valid", async () => {
      const events = await productController.processCsvFile({
        csvFileName: "product-list-ok.csv",
      });
      expect(events.filter((e) => e[0] === "upsert-product")).toHaveLength(10);
    });

    it("should publish events in dead letter queue when data is incorrect", async () => {
      const events = await productController.processCsvFile({
        csvFileName: "product-list-data-error.csv",
      });
      expect(events.filter((e) => e[0] === "upsert-product")).toHaveLength(9);
      expect(
        events.filter((e) => e[0] === "upsert-product-dead-letter")
      ).toHaveLength(1);
    });

    it("should throw error when csv file is invalid", async () => {
      try {
        await productController.processCsvFile({
          csvFileName: "product-list-invalid.csv",
        });
      } catch (error) {
        expect(error);
      }
    });
  });
});
