import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  zip_code: string = '';
  email: string = '';
  errMsg: string = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
      this.calculateTotal();
    });

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
  handleCheckout() {
    if (
      !this.name ||
      !this.surname ||
      !this.email ||
      !this.address ||
      !this.zip_code
    ) {
      this.errMsg = 'Please fill in all required fields';
      return;
    }

    const checkoutData = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      address: this.address,
      zip_code: this.zip_code,
    };

    this.cartService.checkout(checkoutData).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.router.navigate(['/success'], {
          state: { message: 'Your order was placed successfully!' },
        });
      },
      error: (err) => {
        console.error('checkout error:', err);
      },
    });
  }
}
