// File: src/modules/product/infrastructure/prisma/product.prisma.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { ProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const products = await this.prismaService.product.findMany();
    return products.map(
      (p) => new Product(p.id, p.name, p.userId, p.createdAt, p.updatedAt)
    );
  }

  async findByUserId(userId: number): Promise<Product[]> {
    const products = await this.prismaService.product.findMany({
      where: { userId },
    });
    return products.map(
      (p) => new Product(p.id, p.name, p.userId, p.createdAt, p.updatedAt)
    );
  }
}
