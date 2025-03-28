import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData);
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    // Преобразуем free_tiers в число, если оно есть
    const dataToSend = {
      ...userData,
      free_tiers: userData.free_tiers !== undefined ? Number(userData.free_tiers) : undefined
    };

    return this.http.put<User>(`${this.apiUrl}/users/${id}`, dataToSend);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }
} 