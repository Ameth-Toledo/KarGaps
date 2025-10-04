import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private apiUrl = 'http://localhost:8080/api/gorras';

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
}