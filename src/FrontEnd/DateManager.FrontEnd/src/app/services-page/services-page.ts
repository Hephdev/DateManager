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
