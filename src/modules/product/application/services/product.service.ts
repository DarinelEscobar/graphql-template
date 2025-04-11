import { Injectable, Inject } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository.interface';

@Injectable()
export class ProductService {
  constructor(
    @Inject('ProductRepository') private readonly productRepository: ProductRepository,
  ) {}

  async getAllProducts() {
    return this.productRepository.findAll();
  }

  async getProductsByUserId(userId: number) {
    return this.productRepository.findByUserId(userId);
  }
}
