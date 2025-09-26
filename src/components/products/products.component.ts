import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { FetchProductsService } from '../../services/fetch-products.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  links: any = {};
  currentPage = 1;
  meta: any = {};
  showFilterDropdown = false;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  hideResults: boolean = false;
  showSortBy = false;
  sortOption: string = '';

  @ViewChild('sortDropdown') sortDropdown!: ElementRef;
  @ViewChild('filterDropdown') filterDropdown!: ElementRef;

  sortOptions = [
    { label: 'New Products First', value: 'created_at' },
    { label: 'Price, low to high', value: 'price' },
    { label: 'Price, high to low', value: '-price' },
  ];

  applySort(option: string) {
    this.sortOption = option;
    this.loadProducts(
      this.currentPage,
      this.minPrice,
      this.maxPrice,
      this.sortOption
    );
    this.showSortBy = false;
  }
  sortOptionLabel(): string {
    const selected = this.sortOptions.find((o) => o.value === this.sortOption);
    return selected ? selected.label : 'Sort By';
  }

  constructor(
    private productService: FetchProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts(this.currentPage);
  }
  toggleFilterDropdown() {
    this.showFilterDropdown = !this.showFilterDropdown;
  }
  toggleSortDropDown() {
    this.showSortBy = !this.showSortBy;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.showSortBy &&
      this.sortDropdown &&
      !this.sortDropdown.nativeElement.contains(event.target)
    ) {
      this.showSortBy = false;
    }
    if (
      this.showFilterDropdown &&
      this.filterDropdown &&
      !this.filterDropdown.nativeElement.contains(event.target)
    ) {
      this.showFilterDropdown = false;
    }
  }

  applyFilter() {
    this.currentPage = 1;
    this.loadProducts(this.currentPage, this.minPrice, this.maxPrice);
    this.showFilterDropdown = false;
  }

  loadProducts(
    page: number,
    minPrice?: number | null,
    maxPrice?: number | null,
    sort?: string
  ) {
    this.productService.getProducts(page, minPrice, maxPrice, sort).subscribe({
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
    for (let i = 1; i <= last; i++) {
      if (i <= 2 || i > last - 2 || Math.abs(i - this.currentPage) <= 1) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== -1) {
        pages.push(-1);
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
  isFiltered(): boolean {
    return this.minPrice != null || this.maxPrice != null;
  }
  goToProduct(id: number) {
    this.router.navigate(['/products', id]);
  }
}
