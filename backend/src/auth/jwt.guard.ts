import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import pkg from 'jsonwebtoken';
const { verify } = pkg;

const JWT_SECRET = 'this-is-a-secret-key-change-later';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('توکن ارسال نشده');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload = verify(token, JWT_SECRET) as { userId: number; email: string };
      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('توکن نامعتبر است');
    }
  }
}