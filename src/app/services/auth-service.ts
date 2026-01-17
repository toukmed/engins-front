import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Utils } from '../utils/Utils';
import { UserDto, UserEntity, AuthResponse } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = Utils.getUrl() + '/api/v1';
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient, private router: Router) {}

  register(user: UserEntity): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user);
  }

  login(user: UserDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, user).pipe(
      tap((response) => this.setToken(response.token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}
