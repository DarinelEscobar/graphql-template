import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    if (!user) throw new ForbiddenException('No se encontró información de usuario en el token');
    if (!requiredRoles.includes(user.rol)) {
      throw new ForbiddenException(
        `Rol no autorizado. Se requiere alguno de: [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
