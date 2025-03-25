import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey
    });

    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers });
  }

  getUserById(id: string): Observable<User> {
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey
    });

    return this.http.get<User>(`${this.apiUrl}/users/${id}`, { headers });
  }

  createUser(userData: Partial<User>): Observable<User> {
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json'
    });

    return this.http.post<User>(`${this.apiUrl}/users`, userData, { headers });
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json'
    });

    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, userData, { headers });
  }

  deleteUser(id: string): Observable<void> {
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey
    });

    return this.http.delete<void>(`${this.apiUrl}/users/${id}`, { headers });
  }
} 