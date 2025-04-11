// src/modules/product/adapters/graphql/product.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ProductService } from '../../application/services/product.service';
import { ProductType } from './product.type';

@Resolver(() => ProductType)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  // Obtener todos los productos
  @Query(() => [ProductType], { name: 'products' })
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  // Obtener productos por userId
  @Query(() => [ProductType], { name: 'productsByUser' })
  async getProductsByUserId(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.productService.getProductsByUserId(userId);
  }
}
