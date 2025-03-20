import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistoryGeneration } from '../models/history-generation.interface';
import { SortEnum } from '../models/sort.enum';

@Injectable({
  providedIn: 'root'
})
export class HistoryGenerationService {
  private readonly apiUrl = `${environment.apiUrl}/history-generation`;

  constructor(private http: HttpClient) {}

  getHistory(sort: SortEnum = SortEnum.DESC): Observable<HistoryGeneration[]> {
    return this.http.get<HistoryGeneration[]>(`${this.apiUrl}?sort=${sort}`);
  }
} 