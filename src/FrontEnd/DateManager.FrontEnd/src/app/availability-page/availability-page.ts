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
