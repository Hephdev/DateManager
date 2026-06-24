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
