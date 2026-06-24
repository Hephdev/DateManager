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
