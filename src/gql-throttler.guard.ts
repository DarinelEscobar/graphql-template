// gql-throttler.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    // Nest’s ThrottlerGuard expects { req, res }
    const ctx = gqlContext.getContext();
    return { req: ctx.req, res: ctx.res };
  }
}
