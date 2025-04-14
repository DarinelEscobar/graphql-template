import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ProductService } from '../../application/services/product.service';
import { ProductType } from './product.type';
import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { GqlAuthGuard } from '../../../auth/guards/gql-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';


@Resolver(() => ProductType)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  // Obtener todos los productos - Solo rol CHEF
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('CHEF')
  @Query(() => [ProductType], { name: 'products' })
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  // Obtener productos por userId - Permitido a 'USER' o 'CHEF'
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('USER', 'CHEF')
  @Query(() => [ProductType], { name: 'productsByUser' })
  async getProductsByUserId(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.productService.getProductsByUserId(userId);
  }
}
