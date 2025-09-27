import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'https://api.redseam.redberryinternship.ge/api/login';
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  //  Register
  register(data: {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    avatar?: File;
  }) {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('password_confirmation', data.password_confirmation);

    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }

    return this.http.post(
      'https://api.redseam.redberryinternship.ge/api/register',
      formData
    );
  }

  // register zevit

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          this.setToken(res.token);
        }
        if (res.user?.email) {
          localStorage.setItem('userEmail', res.user.email);
        }
      })
    );
  }
  setToken(token: string) {
    localStorage.setItem('token', token);
    this.loggedIn$.next(true);
  }

  logOut() {
    localStorage.removeItem('token');
    this.loggedIn$.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
