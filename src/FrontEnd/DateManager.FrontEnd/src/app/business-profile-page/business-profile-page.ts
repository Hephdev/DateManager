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
