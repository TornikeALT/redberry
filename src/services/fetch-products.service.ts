import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FetchProductsService {
  private apiUrl = 'https://api.redseam.redberryinternship.ge/api/products';

  constructor(private http: HttpClient) {}

  getProducts(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}`);
  }
}
