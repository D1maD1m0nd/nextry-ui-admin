import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { Feedback } from '../models/feedback.interface';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private readonly apiUrl = `${environment.apiUrl}/feedback`;
  private readonly TIMEOUT = 10000; // 10 seconds

  constructor(private http: HttpClient) {}

  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiUrl).pipe(
      timeout(this.TIMEOUT)
    );
  }
} 