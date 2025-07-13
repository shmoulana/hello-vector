import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { User } from '../../entities/user.entity';
import { CreateOrderDto } from '../../dto/create-order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, restaurantName, productName, quantity, price } = createOrderDto;
    
    try {
      // Ensure user exists
      await this.ensureUserExists(userId);
      
      // Create order
      const order = this.orderRepository.create({
        userId,
        restaurantName,
        productName,
        quantity,
        price,
      });

      const savedOrder = await this.orderRepository.save(order);
      this.logger.log(`Created order: ${productName} for user ${userId}`);
      
      return savedOrder;
    } catch (error) {
      this.logger.error('Failed to create order', error);
      throw new Error('Failed to create order');
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.orderRepository.find({ 
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: number): Promise<Order | null> {
    return this.orderRepository.findOne({ where: { id } });
  }

  async getUserOrderHistory(userId: string, limit: number = 50): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getUserOrderedProducts(userId: string): Promise<{ productName: string; restaurantName: string; totalQuantity: number; avgPrice: number }[]> {
    const query = `
      SELECT 
        product_name as "productName",
        restaurant_name as "restaurantName",
        SUM(quantity) as "totalQuantity",
        AVG(price) as "avgPrice"
      FROM orders 
      WHERE user_id = $1
      GROUP BY product_name, restaurant_name
      ORDER BY SUM(quantity) DESC
    `;
    
    return this.orderRepository.query(query, [userId]);
  }

  private async ensureUserExists(userId: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { userId } });
    
    if (!user) {
      user = this.userRepository.create({ userId });
      user = await this.userRepository.save(user);
      this.logger.log(`Created new user: ${userId}`);
    }
    
    return user;
  }

  async createBulk(orders: CreateOrderDto[]): Promise<Order[]> {
    const createdOrders: Order[] = [];
    
    // Process in batches
    const batchSize = 100;
    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(order => this.create(order))
      );
      createdOrders.push(...batchResults);
      
      this.logger.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(orders.length / batchSize)}`);
    }
    
    return createdOrders;
  }
}