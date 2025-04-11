// src/modules/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) {
      // Si no hay roles en el decorador, no restringimos
      return true;
    }
    // Convertimos el ExecutionContext en GqlExecutionContext
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    if (!user) {
      throw new ForbiddenException('No se encontró información de usuario en el token');
    }

    if (!requiredRoles.includes(user.rol)) {
      throw new ForbiddenException(
        `Rol no autorizado. Se requiere alguno de: [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
