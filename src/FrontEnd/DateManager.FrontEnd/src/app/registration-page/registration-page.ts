import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { DateManagerIconComponent } from '../shared/DateManager-icon/DateManager-icon.component';
import { AuthService } from '../auth.service';

const StrongPasswordRegx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

@Component({
  selector: 'app-registration-page',
  imports: [FormsModule, NgIf, DateManagerIconComponent],
  templateUrl: './registration-page.html',
  styleUrl: './registration-page.scss',
})
export class RegistrationPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  confirmPassword = '';
  err = '';
  loading = signal(false);
  passwordStrength: 'weak' | 'medium' | 'strong' | '' = '';

  onPasswordChange() {
    const p = this.password;
    if (!p) { this.passwordStrength = ''; return; }
    let score = 0;
    if (p.length >= 8)          score++;
    if (/[A-Z]/.test(p))        score++;
    if (/[a-z]/.test(p))        score++;
    if (/\d/.test(p))           score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 2)      this.passwordStrength = 'weak';
    else if (score <= 3) this.passwordStrength = 'medium';
    else                 this.passwordStrength = 'strong';
  }

  validateSamePassword() {
    this.err = (this.password && this.confirmPassword && this.password !== this.confirmPassword)
      ? 'Las contraseñas no coinciden.'
      : '';
  }

  submit() {
    this.err = '';
    if (!this.username.trim() || !this.password.trim()) {
      this.err = 'Por favor ingresa usuario y contraseña.';
      return;
    }
    if (!StrongPasswordRegx.test(this.password)) {
      this.err = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.err = 'Las contraseñas no coinciden.';
      return;
    }
    this.loading.set(true);
    this.auth.register(this.username, this.password);
    this.loading.set(false);
    this.router.navigate(['/Login']);
  }
}
