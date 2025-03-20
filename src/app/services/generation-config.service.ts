import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenerationConfig } from '../models/generation-config.interface';
import { GenerationConfigDetail } from '../models/generation-config-detail.interface';

@Injectable({
  providedIn: 'root'
})
export class GenerationConfigService {
  private readonly apiUrl = `${environment.apiUrl}/generation-config`;

  constructor(private http: HttpClient) {}

  getConfigs(): Observable<GenerationConfig[]> {
    return this.http.get<GenerationConfig[]>(this.apiUrl);
  }

  getConfigById(id: string): Observable<GenerationConfigDetail> {
    return this.http.get<GenerationConfigDetail>(`${this.apiUrl}/${id}`);
  }
} 