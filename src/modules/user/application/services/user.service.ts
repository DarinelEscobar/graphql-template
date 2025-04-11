// src/modules/user/application/services/user.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async getUser(id: number) {
    return this.userRepository.findById(id);
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }
}
