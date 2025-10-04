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
  private apiUrl = 'http://localhost:8080/api/playeras';

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
}