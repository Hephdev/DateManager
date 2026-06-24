# DateManager Frontend Phase 1 — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Angular frontend for DateManager Phase 1 — auth pages, owner dashboard (profile, services, availability, appointments), and a public client booking page — using mock/in-memory data so no real backend is needed.

**Architecture:** Standalone Angular 21 components with lazy-loaded routes, template-driven forms (`FormsModule`), Angular signals for local reactive state, and injectable services with in-memory mock data. Owner pages share a sidebar layout component; the public booking page is a standalone page accessible without login.

**Tech Stack:** Angular 21 (standalone), Angular Router (lazy loading + child routes), FormsModule (template-driven, `[(ngModel)]`), Angular Signals (`signal()`, `computed()`), SCSS (CSS custom properties), TypeScript interfaces, Google Material Icons (CDN — no npm install required).

## Global Constraints

- Angular 21 standalone components only — no NgModules, no `declarations` arrays.
- Template-driven forms with `[(ngModel)]` — do NOT use `ReactiveFormsModule`.
- Use Angular signals (`signal()`, `computed()`) for reactive state in components and services.
- Use modern Angular control flow (`@if`, `@for`) in **new** template files — no import of `NgIf`/`NgFor` needed.
- Keep existing pages (`login-page`, `registration-page`) using `*ngIf` with `NgIf` import — only new pages use `@if`.
- All UI text in **Spanish** — match the tone of existing pages.
- Follow existing component naming: folder `foo-page/`, file `foo-page.ts`, exported class `FooPage`. Exception: the layout and shared components use `layout.component.ts` / `LayoutComponent`.
- All services use **mock/in-memory data** — no real HTTP calls. `provideHttpClient()` is added to `app.config.ts` as a preparation for the real backend.
- CSS classes must match existing patterns: `btn primary lg block`, `field`, `input-group`, `input`, `login-bg`, `login-card`, `datemanager-logo`, etc.
- No external npm libraries (no FullCalendar, no Angular Material, no NgBootstrap).

---

## File Map

### New files
| File | Responsibility |
|------|---------------|
| `src/styles.scss` | Global CSS custom properties, resets, buttons, forms, cards, layout classes, status badges, booking styles |
| `src/app/shared/models.ts` | All TypeScript interfaces: `BusinessProfile`, `Service`, `AvailabilityWindow`, `Appointment`, `Slot` |
| `src/app/shared/DateManager-icon/DateManager-icon.component.ts` | Updated icon component mapping custom names → Google Material Icons |
| `src/app/auth.service.ts` | `AuthService` — mock login/register/logout with `localStorage`, exposes `isLoggedIn` signal |
| `src/app/auth.guard.ts` | `authGuard` — functional route guard, redirects to `/Login` if not logged in |
| `src/app/business.service.ts` | `BusinessService` — in-memory CRUD for profile, services, availability windows, appointments + slot generation logic |
| `src/app/shared/layout/layout.component.ts` | Sidebar navigation + `<router-outlet>` for owner dashboard area |
| `src/app/shared/layout/layout.component.html` | Sidebar HTML |
| `src/app/shared/layout/layout.component.scss` | (empty — all styles in global `styles.scss`) |
| `src/app/business-profile-page/business-profile-page.ts` | Owner page: edit business profile form |
| `src/app/business-profile-page/business-profile-page.html` | Business profile template |
| `src/app/business-profile-page/business-profile-page.scss` | (empty) |
| `src/app/services-page/services-page.ts` | Owner page: list + add/edit/delete services |
| `src/app/services-page/services-page.html` | Services template |
| `src/app/services-page/services-page.scss` | (empty) |
| `src/app/availability-page/availability-page.ts` | Owner page: weekly availability windows editor |
| `src/app/availability-page/availability-page.html` | Availability template |
| `src/app/availability-page/availability-page.scss` | (empty) |
| `src/app/appointments-page/appointments-page.ts` | Owner page: appointment list with tabs + approve/decline/cancel |
| `src/app/appointments-page/appointments-page.html` | Appointments template |
| `src/app/appointments-page/appointments-page.scss` | (empty) |
| `src/app/booking-page/booking-page.ts` | Public booking page: 3-step flow (service → slot → form) |
| `src/app/booking-page/booking-page.html` | Booking template |
| `src/app/booking-page/booking-page.scss` | (empty) |

### Modified files
| File | Change |
|------|--------|
| `src/index.html` | Add Google Material Icons CDN link, change `lang="en"` → `lang="es"`, update title |
| `src/app/app.config.ts` | Add `provideHttpClient()` |
| `src/app/app.routes.ts` | Add `/dashboard` with child routes (guarded) and `/book/:slug` route |
| `src/app/login-page/login-page.ts` | Inject `AuthService`, call `auth.login()`, navigate to `/dashboard` on success |
| `src/app/login-page/login-page.html` | Fix missing outer wrapper (`login-bg`/`login-card`), add error display |
| `src/app/registration-page/registration-page.ts` | Inject `AuthService`, call `auth.register()`, navigate to `/Login` |

---

## Task 1: Global styles + Material Icons + index.html

**Files:**
- Modify: `src/index.html`
- Create: `src/styles.scss` (currently empty — replace contents)
- Modify: `src/app/shared/DateManager-icon/DateManager-icon.component.ts`

**Interfaces:** none yet

- [ ] **Step 1: Update `src/index.html`**

Replace the full file with:

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>DateManager</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

- [ ] **Step 2: Write global styles in `src/styles.scss`**

Replace the file contents with:

```scss
/* ─── Design tokens ─── */
:root {
  --primary:       #4f46e5;
  --primary-hover: #4338ca;
  --bg:            #f8fafc;
  --card-bg:       #ffffff;
  --border:        #e2e8f0;
  --text:          #0f172a;
  --text-muted:    #64748b;
  --fg-muted:      #64748b;   /* alias used in existing registration page */
  --error:         #ef4444;
  --success:       #22c55e;
  --warning:       #eab308;
  --pending-color: #f97316;

  --radius:        8px;
  --radius-lg:     12px;
  --shadow:        0 1px 3px rgba(0,0,0,.10), 0 1px 2px rgba(0,0,0,.06);
  --shadow-lg:     0 10px 15px -3px rgba(0,0,0,.10), 0 4px 6px -4px rgba(0,0,0,.10);

  --text-sm:  0.875rem;
  --text-md:  1rem;
  --text-lg:  1.125rem;
  --text-xl:  1.25rem;
}

/* ─── Reset ─── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
}
a { color: inherit; }

/* ─── Buttons ─── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: 500;
  transition: background .15s, opacity .15s;
  line-height: 1;

  &.primary   { background: var(--primary); color: #fff; }
  &.primary:hover { background: var(--primary-hover); }
  &.secondary { background: var(--border); color: var(--text); }
  &.secondary:hover { background: #cbd5e1; }
  &.danger    { background: var(--error); color: #fff; }
  &.danger:hover { background: #dc2626; }
  &.sm  { padding: 4px 10px; font-size: 12px; }
  &.lg  { padding: 12px 20px; font-size: var(--text-md); }
  &.block { width: 100%; justify-content: center; }
  &:disabled { opacity: .5; cursor: not-allowed; }
}

/* ─── Form fields ─── */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label { font-size: var(--text-sm); font-weight: 500; }
}

/* Input with icon inside (.input-group > icon + .input) */
.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: #fff;
  padding: 0 12px;
  transition: border-color .15s;

  &:focus-within { border-color: var(--primary); }

  .material-icons { color: var(--text-muted); font-size: 18px; flex-shrink: 0; }
}

/* Bare input inside .input-group */
.input-group .input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 10px 0;
  font-size: var(--text-sm);
  color: var(--text);
  &::placeholder { color: #cbd5e1; }
}

/* Standalone input (outside .input-group) */
input.input,
select.input,
textarea.input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 12px;
  font-size: var(--text-sm);
  color: var(--text);
  background: #fff;
  outline: none;
  transition: border-color .15s;
  &:focus { border-color: var(--primary); }
  &::placeholder { color: #cbd5e1; }
  &.invalid { border-color: var(--error); }
}

/* ─── Status badges ─── */
.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .03em;

  &.pending   { background: #fff7ed; color: var(--pending-color); }
  &.confirmed { background: #f0fdf4; color: var(--success); }
  &.declined  { background: #fef2f2; color: var(--error); }
  &.cancelled { background: #f1f5f9; color: #94a3b8; }
}

/* ─── Auth layout ─── */
.login-bg {
  min-height: 100vh;
  display: flex;
}

.login-card {
  flex: 0 0 460px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 40px;
  background: var(--card-bg);
  box-shadow: var(--shadow-lg);
  z-index: 1;
}

.login-brand {
  margin-bottom: 32px;
  text-align: center;
  .login-tag { color: var(--text-muted); font-size: var(--text-sm); margin-top: 6px; }
}

/* Shared logo mark used in login, registration, booking, sidebar */
.datemanager-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  .datemanager-mark {
    width: 28px;
    height: 28px;
    background: var(--primary);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    span {
      width: 12px;
      height: 12px;
      background: #fff;
      border-radius: 50%;
    }
  }

  .datemanager-word {
    font-weight: 700;
    font-size: var(--text-lg);
    color: var(--text);
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-err {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--error);
  font-size: var(--text-sm);
  padding: 8px 12px;
  background: #fef2f2;
  border-radius: var(--radius);
}

.login-foot {
  margin-top: 20px;
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-muted);
  a { color: var(--primary); text-decoration: none; margin-left: 4px; }
}

.login-aside {
  flex: 1;
  background: linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  .login-hero { text-align: center; }
  .login-hero-inner { display: flex; flex-direction: column; align-items: center; gap: 16px; }
}

/* ─── Dashboard layout ─── */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: var(--text);  /* dark sidebar */
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 24px 12px;
  gap: 2px;
  flex-shrink: 0;
}

.sidebar-brand {
  padding: 0 8px;
  margin-bottom: 24px;

  .datemanager-word { color: #fff; }
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius);
  color: #94a3b8;
  text-decoration: none;
  font-size: var(--text-sm);
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  transition: background .15s, color .15s;

  &:hover     { background: rgba(255,255,255,.08); color: #e2e8f0; }
  &.active    { background: rgba(255,255,255,.12); color: #fff; }

  .material-icons { font-size: 18px; }
}

.sidebar-spacer { flex: 1; }

.dashboard-main {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background: var(--bg);
}

/* ─── Page header ─── */
.page-header {
  margin-bottom: 24px;
  h1 { font-size: var(--text-xl); font-weight: 700; }
  p  { color: var(--text-muted); font-size: var(--text-sm); margin-top: 4px; }
}

/* ─── Card / form section ─── */
.form-section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 24px;
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

/* ─── Table ─── */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);

  th {
    text-align: left;
    padding: 10px 12px;
    background: var(--bg);
    color: var(--text-muted);
    font-weight: 500;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }
}

.table-actions { display: flex; gap: 8px; }

/* ─── Tabs ─── */
.tabs {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid var(--border);
  margin-bottom: 24px;
}

.tab {
  padding: 8px 16px;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  background: none;
  transition: color .15s, border-color .15s;

  &.active        { color: var(--primary); border-bottom-color: var(--primary); }
  &:hover:not(.active) { color: var(--text); }
}

/* ─── Availability grid ─── */
.availability-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.day-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.day-label {
  width: 110px;
  font-weight: 600;
  font-size: var(--text-sm);
  padding-top: 6px;
  flex-shrink: 0;
}

.day-windows {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.window-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-sm);

  input[type="time"] {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 6px 8px;
    font-size: var(--text-sm);
    outline: none;
    &:focus { border-color: var(--primary); }
  }
}

/* ─── Public booking page ─── */
.booking-layout {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 16px;
}

.booking-card {
  width: 100%;
  max-width: 600px;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 40px;
}

.booking-header {
  text-align: center;
  margin-bottom: 28px;
  h1 { font-size: var(--text-xl); font-weight: 700; }
  p  { color: var(--text-muted); font-size: var(--text-sm); margin-top: 4px; }
}

.booking-steps {
  display: flex;
  gap: 6px;
  margin-bottom: 24px;
  .step {
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
    background: var(--border);
    color: var(--text-muted);
    &.active { background: var(--primary); color: #fff; }
  }
}

.service-list { display: flex; flex-direction: column; gap: 10px; }

.service-option {
  padding: 16px;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: border-color .15s, background .15s;
  &:hover { border-color: var(--primary); background: #eef2ff; }
  .service-name     { font-weight: 600; font-size: var(--text-sm); }
  .service-duration { color: var(--text-muted); font-size: 12px; margin-top: 2px; }
}

.slot-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.slot-btn {
  padding: 10px 4px;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  background: #fff;
  cursor: pointer;
  font-size: var(--text-sm);
  text-align: center;
  transition: border-color .15s, background .15s, color .15s;
  &:hover { border-color: var(--primary); background: #eef2ff; color: var(--primary); font-weight: 600; }
}

.date-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 8px;
  text-transform: capitalize;
}

.booking-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.success-box {
  text-align: center;
  padding: 32px 0;
  .success-icon { font-size: 56px; color: var(--success); display: block; margin-bottom: 16px; }
  h2 { font-size: var(--text-lg); font-weight: 700; margin-bottom: 8px; }
  p  { color: var(--text-muted); max-width: 320px; margin: 0 auto; }
}
```

- [ ] **Step 3: Update the icon component — `src/app/shared/DateManager-icon/DateManager-icon.component.ts`**

Replace the full file:

```typescript
import { Component, Input } from '@angular/core';

const ICON_MAP: Record<string, string> = {
  user:     'person',
  ext:      'lock',
  arrow:    'arrow_forward',
  alert:    'warning',
  calendar: 'calendar_month',
  service:  'design_services',
  clock:    'schedule',
  check:    'check_circle',
  close:    'cancel',
  edit:     'edit',
  delete:   'delete',
  add:      'add',
  logout:   'logout',
  business: 'business',
  menu:     'menu',
};

@Component({
  selector: 'DateManager-icon',
  template: `<span class="material-icons" [style.fontSize.px]="size ?? 18">{{ iconName }}</span>`,
})
export class DateManagerIconComponent {
  @Input() name = '';
  @Input() size: number | null = null;

  get iconName(): string {
    return ICON_MAP[this.name] ?? this.name;
  }
}
```

- [ ] **Step 4: Run the app to verify icons and global styles load**

```
ng serve
```

Open `http://localhost:4200`. Navigate to `/Registration`. You should see:
- A styled two-column card (purple aside on the right, form on the left)
- Material Icons rendered as filled icons (person, lock icons)
- Password strength bar still working

---

## Task 2: Shared models + AuthService + AuthGuard + provideHttpClient

**Files:**
- Create: `src/app/shared/models.ts`
- Create: `src/app/auth.service.ts`
- Create: `src/app/auth.guard.ts`
- Modify: `src/app/app.config.ts`

**Interfaces:**
- Produces: `BusinessProfile`, `Service`, `AvailabilityWindow`, `Appointment`, `Slot` — used by Task 6 onward.

- [ ] **Step 1: Create `src/app/shared/models.ts`**

```typescript
export interface BusinessProfile {
  id: number;
  businessName: string;
  slug: string;
  timeZone: string;
  requiresApproval: boolean;
}

export interface Service {
  id: number;
  name: string;
  durationMinutes: number;
  isActive: boolean;
}

export interface AvailabilityWindow {
  id: number;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday … 6 = Saturday
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

export interface Appointment {
  id: number;
  serviceId: number;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  startUtc: string; // ISO 8601
  endUtc: string;
  status: 'Pending' | 'Confirmed' | 'Declined' | 'Cancelled';
}

export interface Slot {
  date: string;      // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}
```

- [ ] **Step 2: Create `src/app/auth.service.ts`**

```typescript
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
```

- [ ] **Step 3: Create `src/app/auth.guard.ts`**

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/Login']);
};
```

- [ ] **Step 4: Update `src/app/app.config.ts`**

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
  ],
};
```

---

## Task 3: Fix Login page — wire up AuthService

**Files:**
- Modify: `src/app/login-page/login-page.ts`
- Modify: `src/app/login-page/login-page.html`

**Interfaces:**
- Consumes: `AuthService.login(email, password): boolean`

- [ ] **Step 1: Replace `src/app/login-page/login-page.ts`**

```typescript
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
```

- [ ] **Step 2: Replace `src/app/login-page/login-page.html`**

The current file is missing its outer wrapper. Replace it entirely:

```html
<div class="login-bg">
  <div class="login-card">
    <div class="login-brand">
      <div class="datemanager-logo">
        <div class="datemanager-mark"><span></span></div>
        <div class="datemanager-word">Date Manager</div>
      </div>
      <p class="login-tag">Sistema Integral de Gestión de Citas</p>
    </div>

    <form class="login-form" (ngSubmit)="submit()">
      <div class="field">
        <label>Usuario</label>
        <div class="input-group">
          <DateManager-icon name="user" />
          <input class="input" [(ngModel)]="username" name="username"
                 placeholder="Ej. lmpm" autocomplete="username" autofocus
                 [class.invalid]="err && !username.trim()" />
        </div>
      </div>

      <div class="field">
        <label>Contraseña</label>
        <div class="input-group">
          <DateManager-icon name="ext" />
          <input class="input" [(ngModel)]="password" name="password"
                 type="password" placeholder="••••••••" autocomplete="current-password"
                 [class.invalid]="err && !password.trim()" />
        </div>
      </div>

      <div *ngIf="err" class="login-err">
        <DateManager-icon name="alert" [size]="14" />
        <span>{{ err }}</span>
      </div>

      <button class="btn primary lg block" type="submit" [disabled]="loading()">
        <span *ngIf="loading()">Verificando…</span>
        <ng-container *ngIf="!loading()">
          Ingresar <DateManager-icon name="arrow" />
        </ng-container>
      </button>

      <button class="btn secondary lg block" type="button"
              (click)="router.navigate(['/Registration'])">
        Registrarse <DateManager-icon name="arrow" />
      </button>
    </form>

    <div class="login-foot">
      <span>¿Problemas para acceder?</span>
      <a href="#">Contactar al administrador</a>
    </div>
  </div>

  <div class="login-aside">
    <div class="login-hero">
      <div class="login-hero-inner">
        <div class="datemanager-logo" style="transform:scale(2.5); margin-bottom: 40px">
          <div class="datemanager-mark"><span></span></div>
          <div class="datemanager-word">DateManager</div>
        </div>
        <p style="color:rgba(255,255,255,.8); font-size:var(--text-md); max-width:280px; text-align:center; line-height:1.6">
          Gestiona tu agenda de forma eficiente.
        </p>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Verify in browser**

Run `ng serve` if not already running. Navigate to `http://localhost:4200`.
- You should see: styled two-column card with Material Icons.
- Type any username + password → should navigate to `/dashboard` (which shows a blank page for now).
- Leave a field empty and submit → should show the Spanish error message.

---

## Task 4: Fix Registration page — wire up AuthService

**Files:**
- Modify: `src/app/registration-page/registration-page.ts`

The HTML is already correct — no changes needed there.

- [ ] **Step 1: Replace `src/app/registration-page/registration-page.ts`**

```typescript
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
```

- [ ] **Step 2: Verify registration flow**

Navigate to `/Registration`. Fill in any username + a valid password (e.g. `Test1234`) + confirm password.
- Submit → should navigate to `/Login`.

---

## Task 5: BusinessService (mock data + CRUD)

**Files:**
- Create: `src/app/business.service.ts`

**Interfaces:**
- Consumes: `BusinessProfile`, `Service`, `AvailabilityWindow`, `Appointment`, `Slot` from `./shared/models`
- Produces: public signals `profile`, `services`, `windows`, `appointments`; methods `updateProfile`, `addService`, `updateService`, `deleteService`, `addWindow`, `saveWindows`, `deleteWindow`, `approveAppointment`, `declineAppointment`, `cancelAppointment`, `getSlots`, `addBooking`

- [ ] **Step 1: Create `src/app/business.service.ts`**

```typescript
import { Injectable, signal } from '@angular/core';
import { BusinessProfile, Service, AvailabilityWindow, Appointment, Slot } from './shared/models';

@Injectable({ providedIn: 'root' })
export class BusinessService {
  profile = signal<BusinessProfile>({
    id: 1,
    businessName: 'Mi Negocio',
    slug: 'mi-negocio',
    timeZone: 'America/Bogota',
    requiresApproval: true,
  });

  services = signal<Service[]>([
    { id: 1, name: 'Consulta General',   durationMinutes: 30, isActive: true },
    { id: 2, name: 'Revisión Completa',  durationMinutes: 60, isActive: true },
    { id: 3, name: 'Seguimiento',        durationMinutes: 20, isActive: false },
  ]);

  windows = signal<AvailabilityWindow[]>([
    { id: 1, dayOfWeek: 1, startTime: '08:00', endTime: '12:00' },
    { id: 2, dayOfWeek: 1, startTime: '14:00', endTime: '18:00' },
    { id: 3, dayOfWeek: 2, startTime: '08:00', endTime: '17:00' },
    { id: 4, dayOfWeek: 3, startTime: '08:00', endTime: '17:00' },
    { id: 5, dayOfWeek: 4, startTime: '09:00', endTime: '13:00' },
    { id: 6, dayOfWeek: 5, startTime: '08:00', endTime: '12:00' },
  ]);

  appointments = signal<Appointment[]>([
    {
      id: 1, serviceId: 1, serviceName: 'Consulta General',
      clientName: 'Juan Pérez', clientEmail: 'juan@example.com', clientPhone: '3001234567',
      startUtc: new Date(Date.now() + 86400000).toISOString(),
      endUtc:   new Date(Date.now() + 86400000 + 1800000).toISOString(),
      status: 'Pending',
    },
    {
      id: 2, serviceId: 2, serviceName: 'Revisión Completa',
      clientName: 'María López', clientEmail: 'maria@example.com', clientPhone: '3109876543',
      startUtc: new Date(Date.now() + 172800000).toISOString(),
      endUtc:   new Date(Date.now() + 172800000 + 3600000).toISOString(),
      status: 'Confirmed',
    },
  ]);

  private nextId = 100;

  // ── Profile ──────────────────────────────────────────────
  updateProfile(p: BusinessProfile): void {
    this.profile.set({ ...p });
  }

  // ── Services ─────────────────────────────────────────────
  addService(s: Omit<Service, 'id'>): void {
    this.services.update(list => [...list, { ...s, id: this.nextId++ }]);
  }

  updateService(s: Service): void {
    this.services.update(list => list.map(x => x.id === s.id ? s : x));
  }

  deleteService(id: number): void {
    this.services.update(list => list.filter(x => x.id !== id));
  }

  // ── Availability ─────────────────────────────────────────
  addWindow(w: Omit<AvailabilityWindow, 'id'>): void {
    this.windows.update(list => [...list, { ...w, id: this.nextId++ }]);
  }

  saveWindows(windows: AvailabilityWindow[]): void {
    this.windows.set([...windows]);
  }

  deleteWindow(id: number): void {
    this.windows.update(list => list.filter(x => x.id !== id));
  }

  // ── Appointments ──────────────────────────────────────────
  approveAppointment(id: number): void {
    this.appointments.update(list =>
      list.map(a => a.id === id ? { ...a, status: 'Confirmed' as const } : a));
  }

  declineAppointment(id: number): void {
    this.appointments.update(list =>
      list.map(a => a.id === id ? { ...a, status: 'Declined' as const } : a));
  }

  cancelAppointment(id: number): void {
    this.appointments.update(list =>
      list.map(a => a.id === id ? { ...a, status: 'Cancelled' as const } : a));
  }

  addBooking(booking: Omit<Appointment, 'id'>): void {
    this.appointments.update(list => [...list, { ...booking, id: this.nextId++ }]);
  }

  // ── Slot generation ───────────────────────────────────────
  // Returns available time slots for a service over the next `days` days.
  getSlots(serviceId: number, days = 14): Slot[] {
    const service = this.services().find(s => s.id === serviceId);
    if (!service) return [];

    const slots: Slot[] = [];
    const now = new Date();

    for (let d = 0; d < days; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() + d);
      const dow = date.getDay() as AvailabilityWindow['dayOfWeek'];
      const dateStr = date.toISOString().split('T')[0];

      const dayWindows = this.windows().filter(w => w.dayOfWeek === dow);

      for (const w of dayWindows) {
        let [sh, sm] = w.startTime.split(':').map(Number);
        const [eh, em] = w.endTime.split(':').map(Number);
        const endTotal = eh * 60 + em;

        while (sh * 60 + sm + service.durationMinutes <= endTotal) {
          const startStr = `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}`;
          const endM = sh * 60 + sm + service.durationMinutes;
          const endStr = `${String(Math.floor(endM / 60)).padStart(2, '0')}:${String(endM % 60).padStart(2, '0')}`;

          // Skip slots that overlap existing Pending or Confirmed appointments
          const slotStart = new Date(`${dateStr}T${startStr}:00Z`).getTime();
          const slotEnd   = new Date(`${dateStr}T${endStr}:00Z`).getTime();
          const hasConflict = this.appointments().some(a => {
            if (a.status === 'Declined' || a.status === 'Cancelled') return false;
            const aStart = new Date(a.startUtc).getTime();
            const aEnd   = new Date(a.endUtc).getTime();
            return slotStart < aEnd && slotEnd > aStart;
          });

          if (!hasConflict) {
            slots.push({ date: dateStr, startTime: startStr, endTime: endStr });
          }

          sm += service.durationMinutes;
          if (sm >= 60) { sh += Math.floor(sm / 60); sm %= 60; }
        }
      }
    }
    return slots;
  }
}
```

---

## Task 6: Owner layout + routes

**Files:**
- Create: `src/app/shared/layout/layout.component.ts`
- Create: `src/app/shared/layout/layout.component.html`
- Create: `src/app/shared/layout/layout.component.scss`
- Modify: `src/app/app.routes.ts`

**Interfaces:**
- Consumes: `AuthService.logout()`, `AuthService.isLoggedIn`; `authGuard`

- [ ] **Step 1: Create `src/app/shared/layout/layout.component.ts`**

```typescript
import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { DateManagerIconComponent } from '../DateManager-icon/DateManager-icon.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DateManagerIconComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/Login']);
  }
}
```

- [ ] **Step 2: Create `src/app/shared/layout/layout.component.html`**

```html
<div class="dashboard-layout">
  <nav class="sidebar">
    <div class="sidebar-brand">
      <div class="datemanager-logo">
        <div class="datemanager-mark"><span></span></div>
        <div class="datemanager-word">DateManager</div>
      </div>
    </div>

    <a class="sidebar-link" routerLink="appointments" routerLinkActive="active">
      <DateManager-icon name="calendar" /> Citas
    </a>
    <a class="sidebar-link" routerLink="services" routerLinkActive="active">
      <DateManager-icon name="service" /> Servicios
    </a>
    <a class="sidebar-link" routerLink="availability" routerLinkActive="active">
      <DateManager-icon name="clock" /> Disponibilidad
    </a>
    <a class="sidebar-link" routerLink="profile" routerLinkActive="active">
      <DateManager-icon name="business" /> Mi Negocio
    </a>

    <div class="sidebar-spacer"></div>

    <button class="sidebar-link" (click)="logout()">
      <DateManager-icon name="logout" /> Cerrar sesión
    </button>
  </nav>

  <main class="dashboard-main">
    <router-outlet />
  </main>
</div>
```

- [ ] **Step 3: Create `src/app/shared/layout/layout.component.scss`** (intentionally empty)

```scss
/* Styles live in src/styles.scss */
```

- [ ] **Step 4: Replace `src/app/app.routes.ts`**

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'Login',
    loadComponent: () => import('./login-page/login-page').then(m => m.LoginPage),
  },
  {
    path: 'Registration',
    loadComponent: () => import('./registration-page/registration-page').then(m => m.RegistrationPage),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'appointments', pathMatch: 'full' },
      {
        path: 'appointments',
        loadComponent: () => import('./appointments-page/appointments-page').then(m => m.AppointmentsPage),
      },
      {
        path: 'services',
        loadComponent: () => import('./services-page/services-page').then(m => m.ServicesPage),
      },
      {
        path: 'availability',
        loadComponent: () => import('./availability-page/availability-page').then(m => m.AvailabilityPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./business-profile-page/business-profile-page').then(m => m.BusinessProfilePage),
      },
    ],
  },
  {
    path: 'book/:slug',
    loadComponent: () => import('./booking-page/booking-page').then(m => m.BookingPage),
  },
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
];
```

- [ ] **Step 5: Verify sidebar layout**

Log in at `/Login`. You should land on `/dashboard/appointments` and see:
- Dark sidebar on the left with navigation links and Material Icons
- Empty main content area on the right
- "Cerrar sesión" button at the bottom of the sidebar works (returns to `/Login`)

---

## Task 7: Business profile page

**Files:**
- Create: `src/app/business-profile-page/business-profile-page.ts`
- Create: `src/app/business-profile-page/business-profile-page.html`
- Create: `src/app/business-profile-page/business-profile-page.scss`

**Interfaces:**
- Consumes: `BusinessService.profile()` (signal), `BusinessService.updateProfile(p: BusinessProfile)`

- [ ] **Step 1: Create `src/app/business-profile-page/business-profile-page.ts`**

```typescript
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BusinessService } from '../business.service';
import { BusinessProfile } from '../shared/models';

const TIMEZONES = [
  'America/Bogota',
  'America/Mexico_City',
  'America/Lima',
  'America/Santiago',
  'America/Argentina/Buenos_Aires',
  'America/New_York',
  'Europe/Madrid',
];

@Component({
  selector: 'app-business-profile-page',
  imports: [FormsModule],
  templateUrl: './business-profile-page.html',
  styleUrl: './business-profile-page.scss',
})
export class BusinessProfilePage {
  private svc = inject(BusinessService);

  // Local copy for editing — avoids mutating the signal directly while typing
  profile: BusinessProfile = { ...this.svc.profile() };
  timezones = TIMEZONES;
  saved = signal(false);

  save() {
    this.svc.updateProfile(this.profile);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2500);
  }
}
```

- [ ] **Step 2: Create `src/app/business-profile-page/business-profile-page.html`**

```html
<div class="page-header">
  <h1>Mi Negocio</h1>
  <p>Configura la información pública de tu negocio.</p>
</div>

<div class="form-section">
  <form (ngSubmit)="save()">
    <div class="form-row">
      <div class="field">
        <label>Nombre del negocio</label>
        <input class="input" [(ngModel)]="profile.businessName" name="businessName"
               placeholder="Ej. Clínica Salud Total" required />
      </div>
      <div class="field">
        <label>URL pública (slug)</label>
        <input class="input" [(ngModel)]="profile.slug" name="slug"
               placeholder="Ej. clinica-salud" required />
        <small style="color: var(--text-muted)">Los clientes acceden en /book/{{ profile.slug }}</small>
      </div>
    </div>

    <div class="form-row" style="margin-top: 16px">
      <div class="field">
        <label>Zona horaria</label>
        <select class="input" [(ngModel)]="profile.timeZone" name="timeZone">
          @for (tz of timezones; track tz) {
            <option [value]="tz">{{ tz }}</option>
          }
        </select>
      </div>
      <div class="field" style="justify-content: flex-end">
        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; margin-top: 24px">
          <input type="checkbox" [(ngModel)]="profile.requiresApproval" name="requiresApproval" />
          Requerir aprobación manual de citas
        </label>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn primary" type="submit">Guardar cambios</button>
      @if (saved()) {
        <span style="color: var(--success); font-size: var(--text-sm)">✓ Cambios guardados</span>
      }
    </div>
  </form>
</div>

<div class="form-section">
  <p style="font-size: var(--text-sm); color: var(--text-muted)">
    Página pública de reservas:
    <strong style="color: var(--text)">/book/{{ profile.slug }}</strong>
  </p>
</div>
```

- [ ] **Step 3: Create `src/app/business-profile-page/business-profile-page.scss`** (empty)

```scss
/* Styles live in src/styles.scss */
```

- [ ] **Step 4: Verify**

Navigate to `/dashboard/profile`. You should see:
- Two-column form grid with name and slug fields
- Timezone select and checkbox
- Saving shows "✓ Cambios guardados" for 2.5 seconds

---

## Task 8: Services management page

**Files:**
- Create: `src/app/services-page/services-page.ts`
- Create: `src/app/services-page/services-page.html`
- Create: `src/app/services-page/services-page.scss`

**Interfaces:**
- Consumes: `BusinessService.services()` (signal), `.addService()`, `.updateService()`, `.deleteService()`

- [ ] **Step 1: Create `src/app/services-page/services-page.ts`**

```typescript
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BusinessService } from '../business.service';
import { Service } from '../shared/models';

@Component({
  selector: 'app-services-page',
  imports: [FormsModule],
  templateUrl: './services-page.html',
  styleUrl: './services-page.scss',
})
export class ServicesPage {
  svc = inject(BusinessService);

  showForm = signal(false);
  editingService: Service | null = null;
  form: Omit<Service, 'id'> = { name: '', durationMinutes: 30, isActive: true };

  openAdd() {
    this.editingService = null;
    this.form = { name: '', durationMinutes: 30, isActive: true };
    this.showForm.set(true);
  }

  openEdit(s: Service) {
    this.editingService = s;
    this.form = { name: s.name, durationMinutes: s.durationMinutes, isActive: s.isActive };
    this.showForm.set(true);
  }

  save() {
    if (!this.form.name.trim()) return;
    if (this.editingService) {
      this.svc.updateService({ ...this.editingService, ...this.form });
    } else {
      this.svc.addService(this.form);
    }
    this.showForm.set(false);
  }

  cancel() {
    this.showForm.set(false);
  }

  delete(id: number) {
    if (confirm('¿Eliminar este servicio?')) this.svc.deleteService(id);
  }
}
```

- [ ] **Step 2: Create `src/app/services-page/services-page.html`**

```html
<div class="page-header">
  <h1>Servicios</h1>
  <p>Gestiona los servicios que ofreces a tus clientes.</p>
</div>

@if (showForm()) {
  <div class="form-section">
    <h3 style="font-size: var(--text-sm); font-weight: 600; margin-bottom: 16px">
      {{ editingService ? 'Editar servicio' : 'Nuevo servicio' }}
    </h3>
    <form (ngSubmit)="save()">
      <div class="form-row">
        <div class="field">
          <label>Nombre</label>
          <input class="input" [(ngModel)]="form.name" name="name"
                 placeholder="Ej. Consulta General" required />
        </div>
        <div class="field">
          <label>Duración (minutos)</label>
          <input class="input" type="number" [(ngModel)]="form.durationMinutes"
                 name="duration" min="5" step="5" required />
        </div>
      </div>
      <div class="form-actions">
        <button class="btn primary" type="submit">Guardar</button>
        <button class="btn secondary" type="button" (click)="cancel()">Cancelar</button>
      </div>
    </form>
  </div>
}

<div class="form-section">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px">
    <h3 style="font-size: var(--text-sm); font-weight: 600">Lista de servicios</h3>
    <button class="btn primary sm" (click)="openAdd()">+ Agregar servicio</button>
  </div>

  <table>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Duración</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      @for (s of svc.services(); track s.id) {
        <tr>
          <td>{{ s.name }}</td>
          <td>{{ s.durationMinutes }} min</td>
          <td>
            <span class="badge" [class.confirmed]="s.isActive" [class.cancelled]="!s.isActive">
              {{ s.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn secondary sm" (click)="openEdit(s)">Editar</button>
              <button class="btn danger sm" (click)="delete(s.id)">Eliminar</button>
            </div>
          </td>
        </tr>
      } @empty {
        <tr>
          <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 32px">
            No hay servicios. Agrega uno con el botón de arriba.
          </td>
        </tr>
      }
    </tbody>
  </table>
</div>
```

- [ ] **Step 3: Create `src/app/services-page/services-page.scss`** (empty)

```scss
/* Styles live in src/styles.scss */
```

- [ ] **Step 4: Verify**

Navigate to `/dashboard/services`:
- Table shows 3 mock services (Consulta General, Revisión Completa, Seguimiento)
- "Agregar servicio" shows the inline form
- Saving adds a row; Editar pre-fills the form; Eliminar asks for confirmation

---

## Task 9: Availability page

**Files:**
- Create: `src/app/availability-page/availability-page.ts`
- Create: `src/app/availability-page/availability-page.html`
- Create: `src/app/availability-page/availability-page.scss`

**Interfaces:**
- Consumes: `BusinessService.windows()` (signal), `.saveWindows(windows: AvailabilityWindow[])`
- Note: The page loads a local copy of windows, lets the user edit time inputs in-place, then saves all at once. Because `localWindows` holds object references, `[(ngModel)]` mutations to `w.startTime`/`w.endTime` update the original objects directly.

- [ ] **Step 1: Create `src/app/availability-page/availability-page.ts`**

```typescript
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BusinessService } from '../business.service';
import { AvailabilityWindow } from '../shared/models';

const DAYS: { dow: number; label: string }[] = [
  { dow: 1, label: 'Lunes'      },
  { dow: 2, label: 'Martes'     },
  { dow: 3, label: 'Miércoles'  },
  { dow: 4, label: 'Jueves'     },
  { dow: 5, label: 'Viernes'    },
  { dow: 6, label: 'Sábado'     },
  { dow: 0, label: 'Domingo'    },
];

@Component({
  selector: 'app-availability-page',
  imports: [FormsModule],
  templateUrl: './availability-page.html',
  styleUrl: './availability-page.scss',
})
export class AvailabilityPage {
  private svc = inject(BusinessService);
  days = DAYS;

  // Local copy: user edits this, then saves all at once
  localWindows: AvailabilityWindow[] = [...this.svc.windows()];
  saved = signal(false);
  private tmpId = 1000;

  windowsForDay(dow: number): AvailabilityWindow[] {
    return this.localWindows.filter(w => w.dayOfWeek === dow);
  }

  addWindow(dow: number): void {
    this.localWindows = [
      ...this.localWindows,
      {
        id: this.tmpId++,
        dayOfWeek: dow as AvailabilityWindow['dayOfWeek'],
        startTime: '09:00',
        endTime: '17:00',
      },
    ];
  }

  deleteWindow(id: number): void {
    this.localWindows = this.localWindows.filter(w => w.id !== id);
  }

  save(): void {
    this.svc.saveWindows(this.localWindows);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2500);
  }
}
```

- [ ] **Step 2: Create `src/app/availability-page/availability-page.html`**

```html
<div class="page-header">
  <h1>Disponibilidad</h1>
  <p>Define los horarios en que recibes citas cada semana.</p>
</div>

<div class="availability-grid">
  @for (day of days; track day.dow) {
    <div class="day-row">
      <div class="day-label">{{ day.label }}</div>
      <div class="day-windows">
        @for (w of windowsForDay(day.dow); track w.id) {
          <div class="window-row">
            <input type="time" [(ngModel)]="w.startTime" [name]="'start-' + w.id" />
            <span style="color: var(--text-muted); font-size: var(--text-sm)">hasta</span>
            <input type="time" [(ngModel)]="w.endTime" [name]="'end-' + w.id" />
            <button class="btn danger sm" type="button" (click)="deleteWindow(w.id)">✕</button>
          </div>
        } @empty {
          <span style="font-size: var(--text-sm); color: var(--text-muted)">Sin horarios — cerrado este día</span>
        }
        <button class="btn secondary sm" type="button" (click)="addWindow(day.dow)">
          + Agregar horario
        </button>
      </div>
    </div>
  }
</div>

<div style="margin-top: 24px; display: flex; align-items: center; gap: 12px">
  <button class="btn primary" (click)="save()">Guardar disponibilidad</button>
  @if (saved()) {
    <span style="color: var(--success); font-size: var(--text-sm)">✓ Guardado</span>
  }
</div>
```

- [ ] **Step 3: Create `src/app/availability-page/availability-page.scss`** (empty)

```scss
/* Styles live in src/styles.scss */
```

- [ ] **Step 4: Verify**

Navigate to `/dashboard/availability`:
- 7 day rows, each showing existing time windows
- Lunes shows two blocks (08:00–12:00 and 14:00–18:00)
- "Agregar horario" adds a new row with default 09:00–17:00
- ✕ removes a row
- "Guardar disponibilidad" saves and shows "✓ Guardado"

---

## Task 10: Appointments page

**Files:**
- Create: `src/app/appointments-page/appointments-page.ts`
- Create: `src/app/appointments-page/appointments-page.html`
- Create: `src/app/appointments-page/appointments-page.scss`

**Interfaces:**
- Consumes: `BusinessService.appointments()` (signal), `.approveAppointment(id)`, `.declineAppointment(id)`, `.cancelAppointment(id)`

- [ ] **Step 1: Create `src/app/appointments-page/appointments-page.ts`**

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { BusinessService } from '../business.service';

type Tab = 'all' | 'pending' | 'confirmed';

@Component({
  selector: 'app-appointments-page',
  imports: [],
  templateUrl: './appointments-page.html',
  styleUrl: './appointments-page.scss',
})
export class AppointmentsPage {
  svc = inject(BusinessService);
  activeTab = signal<Tab>('all');

  filteredAppointments = computed(() => {
    const all = this.svc.appointments();
    const tab = this.activeTab();
    if (tab === 'pending')   return all.filter(a => a.status === 'Pending');
    if (tab === 'confirmed') return all.filter(a => a.status === 'Confirmed');
    return all;
  });

  setTab(tab: Tab) { this.activeTab.set(tab); }

  approve(id: number) { this.svc.approveAppointment(id); }
  decline(id: number) { this.svc.declineAppointment(id); }
  cancel(id: number)  { this.svc.cancelAppointment(id); }

  formatDate(iso: string) {
    return new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      Pending:   'Pendiente',
      Confirmed: 'Confirmada',
      Declined:  'Rechazada',
      Cancelled: 'Cancelada',
    };
    return labels[status] ?? status;
  }

  statusClass(status: string): string {
    return status.toLowerCase();
  }
}
```

- [ ] **Step 2: Create `src/app/appointments-page/appointments-page.html`**

```html
<div class="page-header">
  <h1>Citas</h1>
  <p>Gestiona las solicitudes y citas confirmadas de tu negocio.</p>
</div>

<div class="tabs">
  <button class="tab" [class.active]="activeTab() === 'all'"       (click)="setTab('all')">Todas</button>
  <button class="tab" [class.active]="activeTab() === 'pending'"   (click)="setTab('pending')">Pendientes</button>
  <button class="tab" [class.active]="activeTab() === 'confirmed'" (click)="setTab('confirmed')">Confirmadas</button>
</div>

<div class="form-section">
  <table>
    <thead>
      <tr>
        <th>Cliente</th>
        <th>Servicio</th>
        <th>Fecha y hora</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      @for (a of filteredAppointments(); track a.id) {
        <tr>
          <td>
            <div style="font-weight: 500">{{ a.clientName }}</div>
            <div style="color: var(--text-muted); font-size: 12px">{{ a.clientEmail }}</div>
          </td>
          <td>{{ a.serviceName }}</td>
          <td style="white-space: nowrap">{{ formatDate(a.startUtc) }}</td>
          <td>
            <span class="badge" [class]="statusClass(a.status)">{{ statusLabel(a.status) }}</span>
          </td>
          <td>
            <div class="table-actions">
              @if (a.status === 'Pending') {
                <button class="btn primary sm" (click)="approve(a.id)">Aprobar</button>
                <button class="btn danger sm"  (click)="decline(a.id)">Rechazar</button>
              }
              @if (a.status === 'Confirmed') {
                <button class="btn secondary sm" (click)="cancel(a.id)">Cancelar</button>
              }
            </div>
          </td>
        </tr>
      } @empty {
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 40px">
            No hay citas en esta categoría.
          </td>
        </tr>
      }
    </tbody>
  </table>
</div>
```

- [ ] **Step 3: Create `src/app/appointments-page/appointments-page.scss`** (empty)

```scss
/* Styles live in src/styles.scss */
```

- [ ] **Step 4: Verify**

Navigate to `/dashboard/appointments`:
- Two mock appointments visible in "Todas" tab
- Pending tab shows 1; Confirmed tab shows 1
- Clicking "Aprobar" on a Pending row changes it to Confirmed (badge turns green)
- "Rechazar" changes to Declined; "Cancelar" on Confirmed changes to Cancelled

---

## Task 11: Public booking page

**Files:**
- Create: `src/app/booking-page/booking-page.ts`
- Create: `src/app/booking-page/booking-page.html`
- Create: `src/app/booking-page/booking-page.scss`

**Interfaces:**
- Consumes: `BusinessService.profile()`, `.services()`, `.getSlots(serviceId, days): Slot[]`, `.addBooking(booking)`
- The booking flow has 4 steps controlled by a `step` signal: `'service' | 'slot' | 'form' | 'success'`

- [ ] **Step 1: Create `src/app/booking-page/booking-page.ts`**

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BusinessService } from '../business.service';
import { Service, Slot } from '../shared/models';

type Step = 'service' | 'slot' | 'form' | 'success';

@Component({
  selector: 'app-booking-page',
  imports: [FormsModule],
  templateUrl: './booking-page.html',
  styleUrl: './booking-page.scss',
})
export class BookingPage {
  private svc = inject(BusinessService);

  step             = signal<Step>('service');
  selectedService  = signal<Service | null>(null);
  selectedSlot     = signal<Slot | null>(null);

  clientName  = '';
  clientEmail = '';
  clientPhone = '';
  err         = '';
  loading     = signal(false);

  profile  = this.svc.profile;
  services = computed(() => this.svc.services().filter(s => s.isActive));

  slots = computed(() => {
    const s = this.selectedService();
    return s ? this.svc.getSlots(s.id, 14) : [];
  });

  // Group slots by date for display: [{ date: 'YYYY-MM-DD', slots: Slot[] }]
  slotGroups = computed(() => {
    const grouped: Record<string, Slot[]> = {};
    for (const slot of this.slots()) {
      (grouped[slot.date] ??= []).push(slot);
    }
    return Object.entries(grouped).map(([date, slots]) => ({ date, slots }));
  });

  stepNumber(): number {
    return { service: 1, slot: 2, form: 3, success: 4 }[this.step()];
  }

  selectService(s: Service): void {
    this.selectedService.set(s);
    this.step.set('slot');
  }

  selectSlot(slot: Slot): void {
    this.selectedSlot.set(slot);
    this.step.set('form');
  }

  goBack(): void {
    if (this.step() === 'slot') this.step.set('service');
    else if (this.step() === 'form') this.step.set('slot');
  }

  submit(): void {
    this.err = '';
    if (!this.clientName.trim() || !this.clientEmail.trim()) {
      this.err = 'Por favor completa los campos requeridos.';
      return;
    }
    this.loading.set(true);
    const service = this.selectedService()!;
    const slot    = this.selectedSlot()!;

    this.svc.addBooking({
      serviceId:   service.id,
      serviceName: service.name,
      clientName:  this.clientName,
      clientEmail: this.clientEmail,
      clientPhone: this.clientPhone,
      startUtc:    `${slot.date}T${slot.startTime}:00Z`,
      endUtc:      `${slot.date}T${slot.endTime}:00Z`,
      status:      this.svc.profile().requiresApproval ? 'Pending' : 'Confirmed',
    });
    this.loading.set(false);
    this.step.set('success');
  }

  formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-CO', {
      weekday: 'long', month: 'long', day: 'numeric',
    });
  }
}
```

- [ ] **Step 2: Create `src/app/booking-page/booking-page.html`**

```html
<div class="booking-layout">
  <div class="booking-card">

    <!-- Header with business name -->
    <div class="booking-header">
      <div class="datemanager-logo" style="justify-content: center; margin-bottom: 8px">
        <div class="datemanager-mark"><span></span></div>
        <div class="datemanager-word">{{ profile().businessName }}</div>
      </div>
      <p>Agenda tu cita en línea — sin necesidad de cuenta</p>
    </div>

    <!-- Step indicator (hidden on success) -->
    @if (step() !== 'success') {
      <div class="booking-steps">
        <span class="step" [class.active]="stepNumber() >= 1">1. Servicio</span>
        <span class="step" [class.active]="stepNumber() >= 2">2. Horario</span>
        <span class="step" [class.active]="stepNumber() >= 3">3. Tus datos</span>
      </div>
    }

    <!-- Step 1: Choose service -->
    @if (step() === 'service') {
      <h2 style="font-size: var(--text-md); font-weight: 600; margin-bottom: 16px">
        ¿Qué servicio deseas agendar?
      </h2>
      <div class="service-list">
        @for (s of services(); track s.id) {
          <div class="service-option" (click)="selectService(s)">
            <div class="service-name">{{ s.name }}</div>
            <div class="service-duration">{{ s.durationMinutes }} minutos</div>
          </div>
        } @empty {
          <p style="color: var(--text-muted); text-align: center; padding: 24px">
            Este negocio no tiene servicios activos disponibles.
          </p>
        }
      </div>
    }

    <!-- Step 2: Choose time slot -->
    @if (step() === 'slot') {
      <h2 style="font-size: var(--text-md); font-weight: 600; margin-bottom: 16px">
        Elige un horario — <em style="font-weight:400">{{ selectedService()?.name }}</em>
      </h2>

      @if (slotGroups().length === 0) {
        <p style="color: var(--text-muted); text-align: center; padding: 32px">
          No hay horarios disponibles en los próximos 14 días.
        </p>
      }

      @for (group of slotGroups(); track group.date) {
        <div style="margin-bottom: 20px">
          <div class="date-label">{{ formatDate(group.date) }}</div>
          <div class="slot-grid">
            @for (slot of group.slots; track slot.startTime) {
              <button class="slot-btn" (click)="selectSlot(slot)">
                {{ slot.startTime }}
              </button>
            }
          </div>
        </div>
      }

      <div class="booking-nav">
        <button class="btn secondary" (click)="goBack()">← Volver</button>
      </div>
    }

    <!-- Step 3: Client info form -->
    @if (step() === 'form') {
      <h2 style="font-size: var(--text-md); font-weight: 600; margin-bottom: 4px">
        Tus datos de contacto
      </h2>
      <p style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: 20px">
        {{ selectedService()?.name }}
        · {{ selectedSlot()?.date }}
        · {{ selectedSlot()?.startTime }}
      </p>

      <form (ngSubmit)="submit()">
        <div style="display: flex; flex-direction: column; gap: 12px">
          <div class="field">
            <label>Nombre completo *</label>
            <input class="input" [(ngModel)]="clientName" name="clientName"
                   placeholder="Ej. Juan Pérez" required />
          </div>
          <div class="field">
            <label>Correo electrónico *</label>
            <input class="input" type="email" [(ngModel)]="clientEmail" name="clientEmail"
                   placeholder="juan@ejemplo.com" required />
          </div>
          <div class="field">
            <label>Teléfono (opcional)</label>
            <input class="input" [(ngModel)]="clientPhone" name="clientPhone"
                   placeholder="3001234567" />
          </div>
        </div>

        @if (err) {
          <div class="login-err" style="margin-top: 12px">{{ err }}</div>
        }

        <div class="booking-nav">
          <button class="btn secondary" type="button" (click)="goBack()">← Volver</button>
          <button class="btn primary" type="submit" [disabled]="loading()">
            {{ loading() ? 'Enviando…' : 'Confirmar cita' }}
          </button>
        </div>
      </form>
    }

    <!-- Step 4: Success -->
    @if (step() === 'success') {
      <div class="success-box">
        <span class="success-icon material-icons">check_circle</span>
        <h2>¡Cita agendada!</h2>
        @if (profile().requiresApproval) {
          <p>Tu solicitud fue enviada. El negocio la revisará pronto y recibirás un correo con la confirmación.</p>
        } @else {
          <p>Tu cita fue confirmada automáticamente. ¡Nos vemos pronto!</p>
        }
      </div>
    }

  </div>
</div>
```

- [ ] **Step 3: Create `src/app/booking-page/booking-page.scss`** (empty)

```scss
/* Styles live in src/styles.scss */
```

- [ ] **Step 4: Verify the complete booking flow**

Navigate to `http://localhost:4200/book/mi-negocio`:
1. Should show the business name and a list of 2 active services (Consulta General, Revisión Completa).
2. Click "Consulta General" → moves to slot picker, shows grouped available slots for upcoming weekdays.
3. Click any slot → shows the 3-field form.
4. Fill name and email → click "Confirmar cita" → shows the success screen.
5. In a new tab go to `/dashboard/appointments` → the new booking should appear as "Pendiente".

---

## Self-Review against the spec

| Spec requirement | Covered by |
|------------------|------------|
| Owner register / login | Tasks 3, 4 (mock) |
| Edit business profile (name, slug, timezone, approval) | Task 7 |
| Manage services (CRUD, name, duration, active) | Task 8 |
| Define weekly availability windows | Task 9 |
| Public booking page `/book/{slug}` | Task 11 |
| Client picks service → picks slot → enters data → submits | Task 11 |
| Slot computation (availability windows − existing appointments) | Task 5 `getSlots()` |
| Double-booking prevention | Task 5 `getSlots()` conflict check |
| Auto-confirm vs. manual approval mode | Task 5 `addBooking()` + Task 11 |
| Calendar / appointments list for owner | Task 10 |
| Approve / Decline pending requests | Task 10 |
| Cancel confirmed appointment | Task 10 |
| Auth guard on owner pages | Task 2 `authGuard`, Task 6 routes |
| JWT token (future backend) | Task 2 `AuthService` (localStorage placeholder) |
| `provideHttpClient()` wired up | Task 2 `app.config.ts` |

**Out of scope (backend-only):**
- Email notifications (backend `IHostedService`)
- Reminder job
- Real JWT / ASP.NET Identity
- Persistent database

---

**Plan complete and saved to `docs/superpowers/plans/2026-06-24-frontend-phase1.md`.**

Two execution options:

**1. Subagent-Driven (recommended)** — dispatch a fresh subagent per task with review between tasks

**2. Inline Execution** — run tasks in this same session using the `executing-plans` skill

Which approach?
