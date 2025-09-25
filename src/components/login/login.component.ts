import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  onLogin() {
    const credentials = { email: this.email, password: this.password };
    this.authService.login(credentials).subscribe({
      next: (res: any) => {
        if (res.token) this.authService.setToken(res.token);
        if (res.user?.profile_photo) {
          this.userService.setAvatar(res.user.profile_photo);
        }
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed';
      },
    });
  }
}
