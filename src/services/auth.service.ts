import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'https://api.redseam.redberryinternship.ge/api/login';
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, credentials);
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
