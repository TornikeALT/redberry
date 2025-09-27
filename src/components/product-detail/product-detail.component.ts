import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FetchProductsService } from '../../services/fetch-products.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  loading = true;
  mainImage: string = '';
  selectedColor: string | null = null;
  selectedSize: string | null = null;
  selectedQuantity: number = 1;
  previousPage: number = 1;
  productId!: number;
  validationMsg: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: FetchProductsService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const page = Number(this.route.snapshot.queryParamMap.get('page'));
    this.previousPage = page || 1;
    if (id) {
      this.fetchProduct(id);
    }
  }
  fetchProduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (res) => {
        this.product = res;
        this.loading = false;
        this.mainImage = this.product.cover_image;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }
  selectColor(color: string) {
    this.selectedColor = color;

    const index = this.product.available_colors.indexOf(color);
    if (index !== -1) {
      this.mainImage = this.product.images[index];
    }
  }
  selectSize(size: string) {
    this.selectedSize = size;
  }
  getAvailableQuantities(max: number): number[] {
    return Array.from({ length: max }, (_, i) => i + 1);
  }
  goBack(): void {
    this.router.navigate(['/products'], {
      queryParams: { page: this.previousPage },
    });
  }

  get isOutOfStock(): boolean {
    const noQuantity =
      this.product.quantity === 0 ||
      this.product.quantity === null ||
      this.product.quantity === undefined;

    const noSizes = this.product.available_sizes?.length === 0;

    return noQuantity || noSizes;
  }

  addToCart() {
    this.validationMsg = '';

    if (this.isOutOfStock) {
      this.validationMsg = 'This product is out of stock.';
      return;
    }

    if (this.product.available_colors?.length && !this.selectedColor) {
      this.validationMsg = 'Please select a color.';
      return;
    }

    if (this.product.available_sizes?.length && !this.selectedSize) {
      this.validationMsg = 'Please select a size.';
      return;
    }

    if (this.product.quantity && this.selectedQuantity <= 0) {
      this.validationMsg = 'Please select a valid quantity.';
      return;
    }

    this.cartService
      .addToCart(
        this.productId,
        this.selectedColor || '',
        this.selectedSize || '',
        this.selectedQuantity || 1
      )
      .subscribe({
        next: () => {
          this.validationMsg = '';
        },
        error: () => {
          this.validationMsg = 'Failed to add item to cart.';
        },
      });
  }
}
