import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { OpenAIService } from '../../services/openai.service';
import { CreateProductDto } from '../../dto/create-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private openAIService: OpenAIService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { restaurantName, productName, description } = createProductDto;
    
    // Create text for embedding
    const textForEmbedding = `${restaurantName} ${productName} ${description}`;
    
    try {
      // Generate embedding
      const embedding = await this.openAIService.createEmbedding(textForEmbedding);
      
      // Create product with embedding
      const product = this.productRepository.create({
        restaurantName,
        productName,
        description,
        embeddingVector: embedding,
      });

      const savedProduct = await this.productRepository.save(product);
      this.logger.log(`Created product: ${productName} for ${restaurantName}`);
      
      return savedProduct;
    } catch (error) {
      this.logger.error('Failed to create product', error);
      throw new Error('Failed to create product');
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findById(id: number): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id } });
  }

  async findSimilarProducts(embedding: number[], limit: number = 10): Promise<Product[]> {
    const query = `
      SELECT *, 1 - (embedding_vector <=> $1) as similarity
      FROM products 
      WHERE embedding_vector IS NOT NULL
      ORDER BY embedding_vector <=> $1
      LIMIT $2
    `;
    
    return this.productRepository.query(query, [JSON.stringify(embedding), limit]);
  }

  async createBulk(products: CreateProductDto[]): Promise<Product[]> {
    const createdProducts: Product[] = [];
    
    // Process in batches to avoid overwhelming OpenAI API
    const batchSize = 10;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(product => this.create(product))
      );
      createdProducts.push(...batchResults);
      
      // Small delay between batches
      if (i + batchSize < products.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return createdProducts;
  }
}