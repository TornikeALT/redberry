import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private authService: AuthService, private router: Router) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.avatarFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar() {
    this.avatarFile = null;
    this.avatarPreview = null;

    const inputEl = document.getElementById('avatarInput') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = '';
    }
  }

  onSubmit() {
    if (this.password !== this.password_confirmation) {
      this.errorMsg = 'passwords does not match';
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
      next: (res) => {
        console.log(res);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Registration failed';
      },
    });
  }
}
