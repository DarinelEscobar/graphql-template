// src/modules/auth/gql-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    // Convertimos a un contexto de GraphQL
    const ctx = GqlExecutionContext.create(context);
    // Devolvemos el request que realmente contiene los headers
    return ctx.getContext().req;
  }
}
