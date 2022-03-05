import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from '../services/product.service';
import { MessageService } from '../services/message.service';

class MessageServiceMock {
  async send(queue: string, data: any) {
    return null;
  }
}

describe('ProductController', () => {
  let productController: ProductController;

  beforeEach(async () => {
    const MessageServiceProvider = {
      provide: MessageService,
      useClass: MessageServiceMock,
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService, MessageServiceProvider],
    }).compile();

    productController = app.get<ProductController>(ProductController);
  });

  describe('processCsvFile', () => {
    it('should return 10 events', async () => {
      const events = await productController.processCsvFile({
        csvFileName: "product-list1.csv",
      });
      expect(events).toHaveLength(10);
    });
  });
});
