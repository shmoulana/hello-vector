import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { OpenAIService } from '../../services/openai.service';

@Module({
  imports: [ProductsModule, OrdersModule],
  controllers: [RecommendationsController],
  providers: [RecommendationsService, OpenAIService],
})
export class RecommendationsModule {}