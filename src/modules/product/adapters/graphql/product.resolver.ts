import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ProductService } from '../../application/services/product.service';
import { ProductType } from './product.type';
import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { GqlAuthGuard } from '../../../auth/gql-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';

@Resolver(() => ProductType)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  // Obtener todos los productos - Solo rol ADMIN
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Query(() => [ProductType], { name: 'products' })
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  // Obtener productos por userId - Permitido a 'USER' o 'ADMIN'
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Query(() => [ProductType], { name: 'productsByUser' })
  async getProductsByUserId(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.productService.getProductsByUserId(userId);
  }
}
