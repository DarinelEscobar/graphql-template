// product.module.ts
import { Module } from '@nestjs/common';
import { ProductResolver } from './adapters/graphql/product.resolver';
import { ProductService } from './application/services/product.service';
import { PrismaProductRepository } from './infrastructure/prisma/product.prisma.repository';

@Module({
  providers: [
    ProductResolver,
    ProductService,
    {
      provide: 'ProductRepository',
      useClass: PrismaProductRepository,
    },
  ],
})
export class ProductModule {}
