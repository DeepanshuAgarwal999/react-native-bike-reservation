import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest().user;
    console.log(user)
    const hasRequiredRole = user.isManager;
    return hasRequiredRole;
  }
}
