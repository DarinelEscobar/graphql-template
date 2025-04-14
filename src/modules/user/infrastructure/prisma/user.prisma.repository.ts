import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../../../../prisma/prisma.service';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    const data = await this.prismaService.user.findUnique({ where: { id } });
    if (!data) return null;
    return new User(data.id, data.name, data.email, data.password, data.rol, data.createdAt, data.updatedAt);
  }

  async findAll(): Promise<User[]> {
    const result = await this.prismaService.user.findMany();
    return result.map(
      (data) => new User(data.id, data.name, data.email, data.password, data.rol, data.createdAt, data.updatedAt)
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prismaService.user.findUnique({ where: { email } });
    if (!data) return null;
    return new User(data.id, data.name, data.email, data.password, data.rol, data.createdAt, data.updatedAt);
  }

  async create(data: { name: string; email: string; password: string; rol: string }): Promise<User> {
    const created = await this.prismaService.user.create({ data });
    return new User(created.id, created.name, created.email, created.password, created.rol, created.createdAt, created.updatedAt);
  }
}
