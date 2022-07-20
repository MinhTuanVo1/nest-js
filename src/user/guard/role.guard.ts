import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OutputUserDto } from '../dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: OutputUserDto = request.user;
    return matchRoles(roles, user.role);
  }
}
function matchRoles(roles: string[], userRole: string): boolean {
  const isMatch = roles.findIndex((item) => item === userRole);
  if (isMatch !== -1) {
    return true;
  }
  return false;
}
