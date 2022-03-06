import { Module } from '@nestjs/common';
import { DataServicesModule } from '../../data-services/data-services.module';
import { ProductService } from './product-services.service';

@Module({
  imports: [DataServicesModule],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductServicesModule {}
