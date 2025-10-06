import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Playera } from '../../models/playera';

interface PlayerasResponse {
  playeras: Playera[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerasService {
  private apiUrl = 'https://kargaps.onrender.com/api/playeras';

  constructor(private http: HttpClient) { }

  getPlayeras(): Observable<PlayerasResponse> {
    return this.http.get<PlayerasResponse>(this.apiUrl);
  }

  getPlayeraById(id: number): Observable<Playera> {
    return this.http.get<Playera>(`${this.apiUrl}/${id}`);
  }

  searchPlayeras(query: string): Observable<PlayerasResponse> {
    return this.http.get<PlayerasResponse>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }

  createPlayera(formData: FormData): Observable<Playera> {
    return this.http.post<Playera>(this.apiUrl, formData);
  }

  updatePlayera(id: number, formData: FormData): Observable<Playera> {
    return this.http.put<Playera>(`${this.apiUrl}/${id}`, formData);
  }

  deletePlayera(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}