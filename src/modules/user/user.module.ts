import { Module } from '@nestjs/common';
import { UserResolver } from './adapters/graphql/user.resolver';
import { UserService } from './application/services/user.service';
import { PrismaUserRepository } from './infrastructure/prisma/user.prisma.repository';

@Module({
  providers: [
    UserResolver,
    UserService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: [
    UserService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
