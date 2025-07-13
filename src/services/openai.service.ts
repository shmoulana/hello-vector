import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    
    this.openai = new OpenAI({
      apiKey,
    });
  }

  async createEmbedding(text: string): Promise<number[]> {
    try {
      this.logger.debug(`Creating embedding for text: ${text.substring(0, 100)}...`);
      
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
      });

      return response.data[0].embedding;
    } catch (error) {
      this.logger.error('Failed to create embedding', error);
      throw new Error('Failed to create embedding');
    }
  }

  async createEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      this.logger.debug(`Creating embeddings for ${texts.length} texts`);
      
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts,
        encoding_format: 'float',
      });

      return response.data.map(item => item.embedding);
    } catch (error) {
      this.logger.error('Failed to create embeddings', error);
      throw new Error('Failed to create embeddings');
    }
  }
}