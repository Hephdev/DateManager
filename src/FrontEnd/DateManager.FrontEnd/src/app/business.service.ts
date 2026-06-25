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
      clientName: 'Juan Pérez', clientEmail: 'juan@ejemplo.com', clientPhone: '3001234567',
      startUtc: new Date(Date.now() + 86400000).toISOString(),
      endUtc:   new Date(Date.now() + 86400000 + 1800000).toISOString(),
      status: 'Pending',
    },
    {
      id: 2, serviceId: 2, serviceName: 'Revisión Completa',
      clientName: 'María López', clientEmail: 'maria@ejemplo.com', clientPhone: '3109876543',
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
