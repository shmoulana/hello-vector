import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../../dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.ordersService.findByUserId(userId);
  }

  @Get('user/:userId/history')
  getUserHistory(@Param('userId') userId: string) {
    return this.ordersService.getUserOrderHistory(userId);
  }

  @Get('user/:userId/products')
  getUserProducts(@Param('userId') userId: string) {
    return this.ordersService.getUserOrderedProducts(userId);
  }
}