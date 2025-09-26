import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FetchProductsService {
  private apiUrl = 'https://api.redseam.redberryinternship.ge/api/products';

  constructor(private http: HttpClient) {}

  // getProducts(page: number = 1): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}?page=${page}`);
  // }
  getProducts(
    page: number = 1,
    minPrice?: number | null,
    maxPrice?: number | null
  ): Observable<any> {
    let params = new HttpParams().set('page', page);

    if (minPrice != null) {
      params = params.set('filter[price_from]', minPrice);
    }
    if (maxPrice != null) {
      params = params.set('filter[price_to]', maxPrice);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }
}
