import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'restaurant_name' })
  restaurantName: string;

  @Column({ name: 'product_name' })
  productName: string;

  @Column('text')
  description: string;

  @Column('vector(1536)', { name: 'embedding_vector', nullable: true })
  embeddingVector: number[] | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}