// src/modules/product/domain/repositories/product.repository.interface.ts
import { Product } from '../entities/product.entity';

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findByUserId(userId: number): Promise<Product[]>;
  // Podrías añadir más métodos (create, findById, etc.) según lo necesites
}
