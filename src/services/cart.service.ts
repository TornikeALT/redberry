import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'https://api.redseam.redberryinternship.ge/api/cart';

  // BehaviorSubject to hold cart items and share across components
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    // Fetch initial cart if user is logged in
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

  // Fetch cart from API and update BehaviorSubject
  fetchCart(): void {
    this.http.get<any[]>(this.apiUrl, this.getAuthHeaders()).subscribe({
      next: (cart) => this.cartSubject.next(cart),
      error: (err) => {
        console.error('Failed to fetch cart', err);
        this.cartSubject.next([]); // clear cart on error
      },
    });
  }

  // Add item to cart and refresh cart
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
          this.fetchCart(); // ✅ Refresh cart automatically
        })
      );
  }

  // Update item in cart and refresh cart
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
          this.fetchCart(); // ✅ Refresh cart automatically
        })
      );
  }

  // Remove item from cart and refresh cart
  removeFromCart(productId: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/products/${productId}`, this.getAuthHeaders())
      .pipe(
        tap(() => {
          this.fetchCart(); // ✅ Refresh cart automatically
        })
      );
  }

  // Checkout and clear cart
  checkout(): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/checkout`, {}, this.getAuthHeaders())
      .pipe(
        tap({
          next: () => this.cartSubject.next([]), // clear local cart on successful checkout
        })
      );
  }
}
