import {
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = this.getRequest(context);
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      return false;
    }

    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log('payload', payload);
      request['user'] = payload;
    } catch (error) {
      console.error('JWT verification failed:', error);
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Token has expired');
      }
      throw new ForbiddenException('Invalid token');
    }

    // Check roles if @Roles() decorator is present
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // No roles required
    }

    if (!payload.role || !requiredRoles.includes(payload.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }

  private extractTokenFromHeader(
    request: Request,
  ): string | undefined {
    const [type, token] =
      request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
