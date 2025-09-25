import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FetchProductsService } from '../../services/fetch-products.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  links: any = {};
  currentPage = 1;
  meta: any = {};

  constructor(private productService: FetchProductsService) {}

  ngOnInit(): void {
    this.loadProducts(this.currentPage);
  }

  loadProducts(page: number) {
    this.productService.getProducts(page).subscribe({
      next: (response) => {
        this.products = response.data;
        this.links = response.links;
        this.meta = response.meta;
        this.currentPage = this.meta.current_page;
      },
      error: (err) => console.error('Error fetching products', err),
    });
  }

  goToPage(page: number) {
    this.loadProducts(page);
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const last = this.meta.last_page || 1;

    // Simple logic to show first 2, last 2, and current ±1
    for (let i = 1; i <= last; i++) {
      if (i <= 2 || i > last - 2 || Math.abs(i - this.currentPage) <= 1) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== -1) {
        pages.push(-1); // -1 will represent "..."
      }
    }

    return pages;
  }

  nextPage() {
    if (this.links.next) {
      this.loadProducts(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.links.prev) {
      this.loadProducts(this.currentPage - 1);
    }
  }
}
