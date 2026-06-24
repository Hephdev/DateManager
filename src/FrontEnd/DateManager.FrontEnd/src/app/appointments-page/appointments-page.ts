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
