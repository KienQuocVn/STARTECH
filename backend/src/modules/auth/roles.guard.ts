import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { ROLES_KEY } from './roles.decorator';
import type { AdminPermission, AdminRole, JwtPayload } from './interfaces/jwt-payload.interface';

type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    const requiredPermissions = this.reflector.getAllAndOverride<AdminPermission[]>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Ban khong co quyen thuc hien thao tac nay.');
    }

    if (requiredRoles?.length && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Ban khong co role phu hop de thuc hien thao tac nay.');
    }

    if (requiredPermissions?.length) {
      const grantedPermissions = new Set(user.permissions ?? []);
      const missingPermissions = requiredPermissions.filter((permission) => !grantedPermissions.has(permission));

      if (missingPermissions.length > 0) {
        throw new ForbiddenException('Ban khong co permission phu hop de thuc hien thao tac nay.');
      }
    }

    return true;
  }
}
