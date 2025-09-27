import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  cart: any[] = [];
  totalPrice: number = 0;

  name: string = '';
  surname: string = '';
  address: string = '';
  zip: string = '';
  email: string = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get cart items
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
      this.calculateTotal();
    });

    // Get user email from local storage or auth service
    this.email = localStorage.getItem('userEmail') || '';
  }

  calculateTotal() {
    this.totalPrice = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
  increaseQuantity(item: any) {
    this.cartService
      .updateCart(item.id, item.color, item.size, item.quantity + 1)
      .subscribe(() => {
        this.calculateTotal();
      });
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      this.cartService
        .updateCart(item.id, item.color, item.size, item.quantity - 1)
        .subscribe(() => {
          this.calculateTotal();
        });
    }
  }

  removeItem(item: any) {
    this.cartService
      .removeFromCart(item.id, item.color, item.size)
      .subscribe(() => {
        this.calculateTotal();
      });
  }

  checkout() {
    if (!this.email) {
      alert('Email not found!');
      return;
    }
    if (this.cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    this.cartService.checkout(this.email).subscribe({
      next: () => {
        alert('Checkout successful!');
        this.cart = [];
      },
      error: (err) => {
        console.error(err);
        alert('Checkout failed!');
      },
    });
  }
}
