import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isLoggedIn = false;
  avatarUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.userService.avatar$.subscribe((url) => {
      this.avatarUrl = url;
    });
  }

  logOut() {
    this.authService.logOut();
  }
}
