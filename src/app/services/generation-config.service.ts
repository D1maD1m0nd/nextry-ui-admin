import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenerationConfig } from '../models/generation-config.interface';
import { GenerationConfigDetail } from '../models/generation-config-detail.interface';

@Injectable({
  providedIn: 'root'
})
export class GenerationConfigService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) {}

  getConfigs(): Observable<GenerationConfig[]> {
    return this.http.get<GenerationConfig[]>(`${this.apiUrl}/generation-config`);
  }

  getConfigById(id: string): Observable<GenerationConfigDetail> {
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey
    });
    
    return this.http.get<GenerationConfigDetail>(`${this.apiUrl}/generation-config/${id}`, { headers });
  }

  updateConfig(id: string, data: { config: any }): Observable<GenerationConfigDetail> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey
    });
    
    return this.http.patch<GenerationConfigDetail>(
      `${this.apiUrl}/generation-config/${id}`, 
      data,
      { headers }
    );
  }
} 