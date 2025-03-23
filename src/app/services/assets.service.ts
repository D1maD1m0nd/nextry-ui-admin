import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  private apiUrl = environment.apiUrl;
  private bucket = 'nextry-input';

  constructor(private http: HttpClient) {}

  getFolders(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/assets/${this.bucket}/folders/`);
  }

  getAssets(folder: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/assets/${this.bucket}/folders/${folder}/images`);
  }

  deleteAsset(folder: string | string[], fileName: string): Observable<void> {
    const folderPath = Array.isArray(folder) ? folder.join('/') : folder;
    return this.http.delete<void>(`${this.apiUrl}/assets/${this.bucket}/folders/${folderPath}/images/${fileName}`);
  }

  uploadAssets(folder: string, files: File[]): Observable<void> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return this.http.post<void>(`${this.apiUrl}/assets/${this.bucket}/folders/${folder}/images`, formData);
  }
} 