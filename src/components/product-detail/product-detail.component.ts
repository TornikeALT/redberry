import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchProductsService } from '../../services/fetch-products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  loading = true;
  selectedColor: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: FetchProductsService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.fetchProduct(id);
    }
  }
  fetchProduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (res) => {
        this.product = res;
        this.loading = false;
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
}
