import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pkg from 'jsonwebtoken';
const { verify } = pkg;

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('توکن ارسال نشده');
    }

    const token = authHeader.replace('Bearer ', '');
    const secret = this.config.getOrThrow<string>('JWT_SECRET');

    try {
      const payload = verify(token, secret) as { userId: number; username: string };
      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('توکن نامعتبر است');
    }
  }
}