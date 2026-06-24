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
