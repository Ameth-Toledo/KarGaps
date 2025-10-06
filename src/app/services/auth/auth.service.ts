import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, UserData } from '../../models/user';

interface AuthState {
  isAuthenticated: boolean;
  userData: UserData | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://kargaps.onrender.com/api/auth';
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    userData: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkStoredAuth();
  }

  // Verificar si hay sesión guardada
  private checkStoredAuth(): void {
    const token = localStorage.getItem('token');
    const userDataStr = localStorage.getItem('userData');

    if (token && userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        this.authStateSubject.next({
          isAuthenticated: true,
          userData
        });
      } catch (error) {
        this.logout();
      }
    }
  }

  // Login
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          // Guardar en localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userData', JSON.stringify(response.data));

          // Actualizar estado
          this.authStateSubject.next({
            isAuthenticated: true,
            userData: response.data
          });
        }),
        catchError(this.handleError)
      );
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    this.authStateSubject.next({
      isAuthenticated: false,
      userData: null
    });

    this.router.navigate(['/login']);
  }

  // Obtener token
  getToken(): string | null {
    const userData = this.authStateSubject.value.userData;
    return userData ? userData.token : null;
  }

  // Obtener datos del usuario actual
  getCurrentUserData(): UserData | null {
    return this.authStateSubject.value.userData;
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  // Obtener nombre del usuario
  getUserName(): string {
    const userData = this.getCurrentUserData();
    return userData ? userData.name : '';
  }

  // Obtener email del usuario
  getUserEmail(): string {
    const userData = this.getCurrentUserData();
    return userData ? userData.email : '';
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error en el servidor';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Datos inválidos. Verifica tu correo y contraseña';
          break;
        case 401:
          errorMessage = 'Correo o contraseña incorrectos';
          break;
        case 404:
          errorMessage = 'Usuario no encontrado';
          break;
        case 500:
          errorMessage = 'Error del servidor. Intenta más tarde';
          break;
        default:
          errorMessage = error.error?.message || 'Error al iniciar sesión';
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}