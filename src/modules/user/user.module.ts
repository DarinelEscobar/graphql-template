import { Module } from '@nestjs/common'
import { UserResolver } from './adapters/graphql/user.resolver'
import { UserService } from './application/services/user.service'
import { PrismaUserRepository } from './infrastructure/prisma/user.prisma.repository'
import { BcryptPasswordHasherService } from './domain/services/bcrypt-password-hasher.service'

@Module({
  providers: [
    UserResolver,
    UserService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository
    },
    {
      provide: 'PasswordHasher',
      useClass: BcryptPasswordHasherService
    }
  ],
  exports: [
    UserService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository
    },
    {
      provide: 'PasswordHasher',
      useClass: BcryptPasswordHasherService
    }
  ]
})
export class UserModule {}