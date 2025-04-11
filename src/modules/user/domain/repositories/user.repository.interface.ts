import { User } from '../entities/user.entity';

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
}
