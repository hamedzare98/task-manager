import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg;

const prisma = new PrismaClient();
const JWT_SECRET = 'this-is-a-secret-key-change-later';

@Injectable()
export class AuthService {
  async register(email: string, username: string, password: string) {
    if (username.includes('@')) {
      throw new BadRequestException('نام کاربری نمی‌تواند شامل @ باشد');
    }

    const emailTaken = await prisma.user.findUnique({ where: { email } });
    if (emailTaken) {
      throw new ConflictException('این ایمیل قبلاً ثبت شده');
    }

    const usernameTaken = await prisma.user.findUnique({ where: { username } });
    if (usernameTaken) {
      throw new ConflictException('این نام کاربری قبلاً ثبت شده');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword },
    });

    return { id: user.id, email: user.email, username: user.username };
  }

  async login(identifier: string, password: string) {
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { username: identifier }] },
    });
    if (!user) {
      throw new UnauthorizedException('کاربری با این ایمیل یا نام کاربری پیدا نشد');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('رمز عبور اشتباه است');
    }

    const token = sign({ userId: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return { token };
  }
}