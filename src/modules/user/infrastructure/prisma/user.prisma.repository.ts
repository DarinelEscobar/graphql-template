import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  private prisma = new PrismaClient();

  async findById(id: number): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { id } });
    if (!data) return null;

    return new User(
      data.id,
      data.name,
      data.email,
      data.password,
      data.rol,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findAll(): Promise<User[]> {
    const result = await this.prisma.user.findMany();
    return result.map(
      (data) =>
        new User(
          data.id,
          data.name,
          data.email,
          data.password,
          data.rol,
          data.createdAt,
          data.updatedAt,
        ),
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { email } });
    if (!data) return null;

    return new User(
      data.id,
      data.name,
      data.email,
      data.password,
      data.rol,
      data.createdAt,
      data.updatedAt,
    );
  }
}
