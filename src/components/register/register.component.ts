import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  password_confirmation = '';
  errorMsg = '';
  avatarFile: File | null = null;
  avatarPreview: string | null = null;
  isLoggedIn = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.avatarFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
        if (this.avatarPreview) {
          this.userService.setAvatar(this.avatarPreview);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar() {
    this.avatarFile = null;
    this.avatarPreview = null;
    this.userService.clearAvatar();

    const inputEl = document.getElementById('avatarInput') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = '';
    }
  }

  onSubmit() {
    if (this.password.trim() !== this.password_confirmation) {
      this.errorMsg = 'Passwords do not match';
      return;
    }
    const data = {
      username: this.username,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
      avatar: this.avatarFile || undefined,
    };

    this.authService.register(data).subscribe({
      next: (res: any) => {
        if (res.token) this.authService.setToken(res.token);
        if (res.user?.profile_photo) {
          this.userService.setAvatar(res.user.profile_photo);
        }

        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Registration failed';
      },
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPwd() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  ngOnInit() {
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
    });
  }
}
