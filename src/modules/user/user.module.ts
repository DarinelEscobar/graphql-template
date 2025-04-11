import { Module } from '@nestjs/common';
import { UserResolver } from './adapters/graphql/user.resolver';
import { UserService } from './application/services/user.service';
import { PrismaUserRepository } from './infrastructure/prisma/user.prisma.repository';

// Creamos un TOKEN representativo:
const USER_REPOSITORY_TOKEN = 'UserRepository';

@Module({
  providers: [
    UserResolver,
    UserService,
    // Registramos el provider con el token
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
