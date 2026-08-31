import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface JwtResponse {
  token: string | null;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
  mfaEnabled: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
  mfaCode?: string;
}
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private baseUrl = 'http://localhost:8080/api/auth';
  private currentUser: JwtResponse | null = null;

  constructor(private http: HttpClient) {}

  register(data: SignupRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  login(data: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.baseUrl}/login`, data).pipe(
      tap((res) => {
        this.currentUser = res;
      }),
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        this.currentUser = null;
      }),
    );
  }

  // Interroge le backend pour savoir si le cookie de session est valide
  fetchCurrentUser(): Observable<JwtResponse> {
    return this.http.get<JwtResponse>(`${this.baseUrl}/me`).pipe(
      tap((res) => {
        this.currentUser = res;
      }),
    );
  }

  getCurrentUser(): JwtResponse | null {
    return this.currentUser;
  }
}
