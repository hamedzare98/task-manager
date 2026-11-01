import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body('email') email: string,
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(email, username, password);
  }

  @Post('login')
  login(
    @Body('identifier') identifier: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(identifier, password);
  }
}