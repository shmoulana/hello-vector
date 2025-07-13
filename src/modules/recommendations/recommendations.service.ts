import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { OpenAIService } from '../../services/openai.service';
import { Product } from '../../entities/product.entity';

export interface RecommendationResult {
  product: Product;
  score: number;
  reason: string;
}

@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);

  constructor(
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private openAIService: OpenAIService,
  ) {}

  async getUserRecommendations(userId: string, limit: number = 10): Promise<RecommendationResult[]> {
    try {
      // Get user's order history
      const userOrders = await this.ordersService.getUserOrderedProducts(userId);
      
      if (userOrders.length === 0) {
        this.logger.log(`No order history found for user ${userId}, returning popular products`);
        return this.getPopularProducts(limit);
      }

      // Create embedding for user's preferences based on order history
      const userPreferenceText = userOrders
        .map(order => `${order.restaurantName} ${order.productName}`)
        .join(' ');
      
      const userEmbedding = await this.openAIService.createEmbedding(userPreferenceText);
      
      // Find similar products
      const similarProducts = await this.productsService.findSimilarProducts(userEmbedding, limit * 2);
      
      // Filter out products the user has already ordered
      const orderedProductNames = new Set(userOrders.map(order => order.productName));
      const filteredProducts = similarProducts.filter(
        product => !orderedProductNames.has(product.productName)
      );

      // Convert to recommendation results
      const recommendations: RecommendationResult[] = filteredProducts
        .slice(0, limit)
        .map(product => ({
          product,
          score: product.similarity || 0,
          reason: 'Based on your order history',
        }));

      this.logger.log(`Generated ${recommendations.length} recommendations for user ${userId}`);
      return recommendations;

    } catch (error) {
      this.logger.error(`Failed to generate user recommendations for ${userId}`, error);
      throw new Error('Failed to generate user recommendations');
    }
  }

  async getPreferenceRecommendations(preference: string, limit: number = 10): Promise<RecommendationResult[]> {
    try {
      // Create embedding for the preference
      const preferenceEmbedding = await this.openAIService.createEmbedding(preference);
      
      // Find similar products
      const similarProducts = await this.productsService.findSimilarProducts(preferenceEmbedding, limit);
      
      // Convert to recommendation results
      const recommendations: RecommendationResult[] = similarProducts.map(product => ({
        product,
        score: product.similarity || 0,
        reason: `Matches preference: "${preference}"`,
      }));

      this.logger.log(`Generated ${recommendations.length} preference-based recommendations`);
      return recommendations;

    } catch (error) {
      this.logger.error('Failed to generate preference recommendations', error);
      throw new Error('Failed to generate preference recommendations');
    }
  }

  private async getPopularProducts(limit: number): Promise<RecommendationResult[]> {
    // Fallback: return recent products when no user history is available
    const allProducts = await this.productsService.findAll();
    const recentProducts = allProducts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    return recentProducts.map(product => ({
      product,
      score: 0.5, // Neutral score for popular products
      reason: 'Popular product (no order history available)',
    }));
  }

  async getHybridRecommendations(userId: string, preference?: string, limit: number = 10): Promise<RecommendationResult[]> {
    try {
      const recommendations: RecommendationResult[] = [];
      
      // Get user-based recommendations (70% weight)
      if (userId) {
        const userRecs = await this.getUserRecommendations(userId, Math.ceil(limit * 0.7));
        recommendations.push(...userRecs.map(rec => ({ ...rec, score: rec.score * 0.7 })));
      }
      
      // Get preference-based recommendations (30% weight)
      if (preference) {
        const prefRecs = await this.getPreferenceRecommendations(preference, Math.ceil(limit * 0.3));
        recommendations.push(...prefRecs.map(rec => ({ ...rec, score: rec.score * 0.3 })));
      }
      
      // Remove duplicates and sort by score
      const uniqueRecommendations = this.removeDuplicateRecommendations(recommendations);
      const sortedRecommendations = uniqueRecommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return sortedRecommendations;

    } catch (error) {
      this.logger.error('Failed to generate hybrid recommendations', error);
      throw new Error('Failed to generate hybrid recommendations');
    }
  }

  private removeDuplicateRecommendations(recommendations: RecommendationResult[]): RecommendationResult[] {
    const seen = new Set<number>();
    return recommendations.filter(rec => {
      if (seen.has(rec.product.id)) {
        return false;
      }
      seen.add(rec.product.id);
      return true;
    });
  }
}