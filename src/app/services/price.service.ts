import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Price } from '../models/price.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) {}

  getPrices(): Observable<Price[]> {
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey
    });

    return this.http.get<Price[]>(`${this.apiUrl}/payment`, { headers });
  }
} 