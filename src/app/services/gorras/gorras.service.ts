import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gorra } from '../../models/gorra';

interface GorrasResponse {
  gorras: Gorra[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class GorrasService {
  private apiUrl = 'https://kargaps.onrender.com/api/gorras';

  constructor(private http: HttpClient) { }

  getGorras(): Observable<GorrasResponse> {
    return this.http.get<GorrasResponse>(this.apiUrl);
  }

  getGorraById(id: number): Observable<Gorra> {
    return this.http.get<Gorra>(`${this.apiUrl}/${id}`);
  }

  searchGorras(query: string): Observable<GorrasResponse> {
    return this.http.get<GorrasResponse>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }

  createGorra(formData: FormData): Observable<Gorra> {
    return this.http.post<Gorra>(this.apiUrl, formData);
  }

  updateGorra(id: number, formData: FormData): Observable<Gorra> {
    return this.http.put<Gorra>(`${this.apiUrl}/${id}`, formData);
  }

  deleteGorra(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}