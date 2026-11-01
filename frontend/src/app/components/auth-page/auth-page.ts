import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-auth-page',
  imports: [FormsModule],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css'
})
export class AuthPage {
  isLoginMode = signal(true);
  showPassword = signal(false);
  errorMessage = signal('');

  identifier = '';
  email = '';
  username = '';
  password = '';

  constructor(private authService: Auth, private router: Router) {}

  toggleMode() {
    this.isLoginMode.update(mode => !mode);
    this.errorMessage.set('');
  }

  togglePassword() {
    this.showPassword.update(show => !show);
  }

  onSubmit() {
    this.errorMessage.set('');

    if (this.isLoginMode()) {
      this.authService.login(this.identifier.trim(), this.password).subscribe({
        next: (res) => {
          this.authService.saveToken(res.token);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'خطایی رخ داد');
        }
      });
    } else {
      this.authService.register(this.email.trim(), this.username.trim(), this.password).subscribe({
        next: () => {
          this.identifier = this.username.trim();
          this.password = '';
          this.isLoginMode.set(true);
          this.errorMessage.set('ثبت‌نام موفق بود، حالا وارد شو');
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'خطایی رخ داد');
        }
      });
    }
  }
}