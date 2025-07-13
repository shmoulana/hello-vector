import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { OpenAIService } from '../../services/openai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService, OpenAIService],
  exports: [ProductsService],
})
export class ProductsModule {}