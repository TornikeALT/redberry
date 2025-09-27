import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'https://api.redseam.redberryinternship.ge/api/cart';

  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchCart();
  }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Accept: 'application/json',
      }),
    };
  }

  fetchCart(): void {
    this.http.get<any[]>(this.apiUrl, this.getAuthHeaders()).subscribe({
      next: (cart) => this.cartSubject.next(cart),
      error: (err) => {
        console.error('Failed to fetch cart', err);
        this.cartSubject.next([]);
      },
    });
  }

  addToCart(
    id: number,
    color: string,
    size: string,
    quantity: number
  ): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/products/${id}`,
        { color, size, quantity },
        this.getAuthHeaders()
      )
      .pipe(
        tap(() => {
          this.fetchCart();
        })
      );
  }

  updateCart(
    productId: number,
    color: string,
    size: string,
    quantity: number
  ): Observable<any> {
    return this.http
      .patch(
        `${this.apiUrl}/products/${productId}`,
        { color, size, quantity },
        this.getAuthHeaders()
      )
      .pipe(
        tap(() => {
          this.fetchCart();
        })
      );
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/products/${productId}`, this.getAuthHeaders())
      .pipe(
        tap(() => {
          this.fetchCart(); // ✅ Refresh cart automatically
        })
      );
  }

  checkout(): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/checkout`, {}, this.getAuthHeaders())
      .pipe(
        tap({
          next: () => this.cartSubject.next([]),
        })
      );
  }
}
