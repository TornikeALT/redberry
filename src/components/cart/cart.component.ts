import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  @Input() isCartOpen: boolean = false;
  cart: any[] = [];
  loading = false;
  errMsg: string = '';
  totalItems: number = 0;
  totalPrice: number = 0;
  userEmail: string = '';

  constructor(private cartService: CartService) {}
  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
      this.calculateTotal();
    });
  }

  fetchFromCart() {
    this.loading = true;
    this.cartService.fetchCart();
    this.cartService.cart$.subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: (err) => {
        this.errMsg = 'Failed to load items from cart';
        this.loading = false;
      },
    });
  }

  increaseQuantity(product: any) {
    this.cartService
      .updateCart(product.id, product.color, product.size, product.quantity + 1)
      .subscribe(() => {
        this.fetchFromCart();
      });
  }

  decreaseQuantity(product: any) {
    if (product.quantity > 1) {
      this.cartService
        .updateCart(
          product.id,
          product.color,
          product.size,
          product.quantity - 1
        )
        .subscribe(() => {
          this.fetchFromCart();
        });
    }
  }

  removeItem(item: any) {
    this.cartService.removeFromCart(item.id, item.color, item.size).subscribe();
  }

  calculateTotal() {
    this.totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    this.totalPrice = this.cart.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  }
}
