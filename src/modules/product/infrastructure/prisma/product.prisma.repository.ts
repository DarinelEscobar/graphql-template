// src/modules/product/infrastructure/prisma/product.prisma.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  private prisma = new PrismaClient();

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products.map(
      (p) =>
        new Product(p.id, p.name, p.userId, p.createdAt, p.updatedAt),
    );
  }

  async findByUserId(userId: number): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { userId },
    });
    return products.map(
      (p) =>
        new Product(p.id, p.name, p.userId, p.createdAt, p.updatedAt),
    );
  }
}
