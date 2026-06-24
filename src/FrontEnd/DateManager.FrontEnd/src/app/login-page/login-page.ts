import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { DateManagerIconComponent } from '../shared/DateManager-icon/DateManager-icon.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, NgIf, DateManagerIconComponent],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private auth = inject(AuthService);
  router = inject(Router);

  username = '';
  password = '';
  err = '';
  loading = signal(false);

  submit() {
    this.err = '';
    if (!this.username.trim() || !this.password.trim()) {
      this.err = 'Por favor ingresa usuario y contraseña.';
      return;
    }
    this.loading.set(true);
    const ok = this.auth.login(this.username, this.password);
    this.loading.set(false);
    if (ok) {
      this.router.navigate(['/dashboard']);
    } else {
      this.err = 'Credenciales incorrectas.';
    }
  }
}
