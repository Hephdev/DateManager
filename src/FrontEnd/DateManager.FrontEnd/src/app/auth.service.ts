import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'dm_token';

  // Signal: Se mantiene el estado de inicio de sesión y se actualiza automáticamente cuando cambia
  isLoggedIn = signal(!!localStorage.getItem(this.TOKEN_KEY));

  login(email: string, password: string): boolean {
    if (!email.trim() || !password.trim()) return false;
    // Mock: es decir que no hay un backend real, solo se simula el inicio de sesión
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
