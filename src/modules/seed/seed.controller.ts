import { Controller, Post, Query, ParseIntPipe } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('products')
  async seedProducts(@Query('count', new ParseIntPipe({ optional: true })) count: number = 1000) {
    await this.seedService.seedProducts(count);
    return { message: `Successfully seeded ${count} products` };
  }

  @Post('orders')
  async seedOrders(@Query('count', new ParseIntPipe({ optional: true })) count: number = 100000) {
    await this.seedService.seedOrders(count);
    return { message: `Successfully seeded ${count} orders` };
  }

  @Post('all')
  async seedAll() {
    await this.seedService.seedProducts(1000);
    await this.seedService.seedOrders(100000);
    return { message: 'Successfully seeded 1000 products and 100000 orders' };
  }
}