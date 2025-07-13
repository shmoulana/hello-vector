import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { CreateProductDto } from '../../dto/create-product.dto';
import { CreateOrderDto } from '../../dto/create-order.dto';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private productsService: ProductsService,
    private ordersService: OrdersService,
  ) {}

  async seedProducts(count: number = 1000): Promise<void> {
    this.logger.log(`Starting to seed ${count} products...`);
    
    const restaurants = [
      'McDonald\'s', 'KFC', 'Pizza Hut', 'Subway', 'Burger King',
      'Taco Bell', 'Domino\'s', 'Starbucks', 'Chipotle', 'Wendy\'s'
    ];

    const productTypes = [
      'Burger', 'Pizza', 'Sandwich', 'Salad', 'Fries', 'Chicken', 'Tacos', 'Coffee', 'Smoothie', 'Wrap'
    ];

    const descriptors = [
      'spicy', 'mild', 'crispy', 'grilled', 'fresh', 'organic', 'delicious', 'savory', 'sweet', 'tangy',
      'classic', 'premium', 'signature', 'special', 'house', 'chef\'s', 'homemade', 'traditional'
    ];

    const ingredients = [
      'chicken', 'beef', 'cheese', 'lettuce', 'tomato', 'onion', 'pepperoni', 'mushroom', 'bacon',
      'avocado', 'pickles', 'mayo', 'sauce', 'peppers', 'spinach', 'olives', 'garlic', 'herbs'
    ];

    const products: CreateProductDto[] = [];

    for (let i = 0; i < count; i++) {
      const restaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
      const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
      const descriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
      
      const selectedIngredients = this.getRandomItems(ingredients, Math.floor(Math.random() * 4) + 2);
      
      const productName = `${descriptor.charAt(0).toUpperCase() + descriptor.slice(1)} ${productType}`;
      const description = `A ${descriptor} ${productType.toLowerCase()} made with ${selectedIngredients.join(', ')}. Perfect for ${this.getRandomMealTime()}.`;

      products.push({
        restaurantName: restaurant,
        productName,
        description,
      });
    }

    // Create products in batches
    const batchSize = 50;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await this.productsService.createBulk(batch);
      this.logger.log(`Created batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}`);
    }

    this.logger.log(`Successfully seeded ${count} products`);
  }

  async seedOrders(count: number = 100000): Promise<void> {
    this.logger.log(`Starting to seed ${count} orders...`);
    
    // Get all products first
    const allProducts = await this.productsService.findAll();
    if (allProducts.length === 0) {
      throw new Error('No products found. Please seed products first.');
    }

    const orders: CreateOrderDto[] = [];
    const userIds = this.generateUserIds(1000); // Create 1000 different users

    for (let i = 0; i < count; i++) {
      const product = allProducts[Math.floor(Math.random() * allProducts.length)];
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      
      orders.push({
        userId,
        restaurantName: product.restaurantName,
        productName: product.productName,
        quantity: Math.floor(Math.random() * 5) + 1, // 1-5 items
        price: this.generatePrice(),
      });
    }

    // Create orders in batches
    const batchSize = 1000;
    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);
      await this.ordersService.createBulk(batch);
      this.logger.log(`Created batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(orders.length / batchSize)}`);
    }

    this.logger.log(`Successfully seeded ${count} orders`);
  }

  private getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private getRandomMealTime(): string {
    const times = ['breakfast', 'lunch', 'dinner', 'snack', 'late-night cravings'];
    return times[Math.floor(Math.random() * times.length)];
  }

  private generateUserIds(count: number): string[] {
    const userIds: string[] = [];
    for (let i = 1; i <= count; i++) {
      userIds.push(`user_${i.toString().padStart(4, '0')}`);
    }
    return userIds;
  }

  private generatePrice(): number {
    // Generate prices between $3.99 and $29.99
    return Math.round((Math.random() * 26 + 3.99) * 100) / 100;
  }
}