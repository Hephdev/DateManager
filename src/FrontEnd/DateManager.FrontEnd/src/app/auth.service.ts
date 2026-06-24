import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'dm_token';

  // Signal: true when a token exists in localStorage
  isLoggedIn = signal(!!localStorage.getItem(this.TOKEN_KEY));

  login(email: string, password: string): boolean {
    if (!email.trim() || !password.trim()) return false;
    // Mock: accept any non-empty credentials
    localStorage.setItem(this.TOKEN_KEY, 'mock-jwt-token');
    this.isLoggedIn.set(true);
    return true;
  }

  register(email: string, password: string): boolean {
    if (!email.trim() || !password.trim()) return false;
    localStorage.setItem(this.TOKEN_KEY, 'mock-jwt-token');
    this.isLoggedIn.set(true);
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
