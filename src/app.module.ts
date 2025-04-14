// app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, seconds } from '@nestjs/throttler';

// Import the custom GqlThrottlerGuard
import { GqlThrottlerGuard } from './gql-throttler.guard';

import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: seconds(60),
          limit: 100, //Lower it as required
        },
      ],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: process.env.GRAPHQL_PLAYGROUND === 'true',
      context: ({ req, res }) => ({
        req,
        res,
      }),
    }),
    PrismaModule,
    UserModule,
    ProductModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard, // Use the custom guard here
    },
  ],
})
export class AppModule {}
