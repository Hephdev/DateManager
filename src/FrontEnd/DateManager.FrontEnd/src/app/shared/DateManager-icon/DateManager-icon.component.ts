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
