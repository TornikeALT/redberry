import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FetchProductsService } from '../../services/fetch-products.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(
    private route: ActivatedRoute,
    private productService: FetchProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
}
