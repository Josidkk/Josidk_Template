import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';
import { CalendarEventDialogComponent, CalendarEventData, EVENT_COLORS } from '../../shared/calendar-event-dialog/calendar-event-dialog.component';
import { NotificationService } from '../../core/services/notification.service';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  color: string;
  description: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Apps', route: '/calendar' },
    { label: 'Calendario' },
  ];

  currentDate = signal(new Date());
  selectedDay = signal(new Date().getDate());

  /* ── Month picker ── */
  showMonthPicker = signal(false);
  pickerYear = signal(new Date().getFullYear());

  months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  /** In-memory events store: day number → events array. */
  events = signal<Record<number, CalendarEvent[]>>({
    3: [{ id: 'e1', title: 'Reunión de equipo', time: '10:00', color: '#3b82f6', description: 'Sprint planning semanal' }],
    5: [{ id: 'e2', title: 'Entrega sprint', time: '14:00', color: '#22c55e', description: 'Demo de funcionalidades al cliente' }],
    7: [
      { id: 'e3', title: 'Standup diario', time: '09:00', color: '#8b5cf6', description: 'Daily con el equipo de desarrollo' },
      { id: 'e4', title: 'Code review', time: '15:00', color: '#f59e0b', description: 'Revisar PR del módulo de facturación' },
    ],
    10: [{ id: 'e5', title: 'Demo cliente', time: '11:00', color: '#ef4444', description: 'Presentación del nuevo dashboard' }],
    12: [{ id: 'e6', title: 'Planning Q3', time: '10:00', color: '#3b82f6', description: 'Planificación del próximo trimestre' }],
    15: [{ id: 'e7', title: 'Retrospectiva', time: '16:00', color: '#8b5cf6', description: 'Retro del último sprint' }],
    18: [{ id: 'e8', title: 'Taller de diseño', time: '09:30', color: '#f59e0b', description: 'Workshop de UX para el nuevo módulo' }],
    20: [{ id: 'e9', title: 'Release v2.0', time: '14:00', color: '#22c55e', description: 'Despliegue a producción' }],
    25: [{ id: 'e10', title: 'All Hands', time: '10:00', color: '#3b82f6', description: 'Reunión general de la empresa' }],
  });

  private idCounter = 11;

  get monthName(): string {
    return this.currentDate().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  }

  /** Título dinámico del panel lateral con el nombre del mes correcto. */
  get selectedDayTitle(): string {
    const day = this.selectedDay();
    const date = this.currentDate();
    const month = date.toLocaleDateString('es-ES', { month: 'long' });
    return `${day} de ${month}`;
  }

  get calendarDays(): (number | null)[] {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }

  /* ── Month picker ── */
  openMonthPicker(): void {
    this.pickerYear.set(this.currentDate().getFullYear());
    this.showMonthPicker.set(true);
  }

  closeMonthPicker(): void {
    this.showMonthPicker.set(false);
  }

  prevPickerYear(): void {
    this.pickerYear.update(y => y - 1);
  }

  nextPickerYear(): void {
    this.pickerYear.update(y => y + 1);
  }

  selectPickerMonth(monthIndex: number): void {
    const d = new Date(this.currentDate());
    d.setFullYear(this.pickerYear(), monthIndex, 1);
    this.currentDate.set(d);
    const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    this.selectedDay.update(day => Math.min(day, maxDay));
    this.showMonthPicker.set(false);
  }

  isCurrentMonth(monthIndex: number): boolean {
    const now = new Date();
    return monthIndex === now.getMonth() && this.pickerYear() === now.getFullYear();
  }

  isActiveMonth(monthIndex: number): boolean {
    return monthIndex === this.currentDate().getMonth() && this.pickerYear() === this.currentDate().getFullYear();
  }

  prevMonth(): void {
    const d = new Date(this.currentDate());
    d.setMonth(d.getMonth() - 1);
    this.currentDate.set(d);
    const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    this.selectedDay.update(day => Math.min(day, maxDay));
  }

  nextMonth(): void {
    const d = new Date(this.currentDate());
    d.setMonth(d.getMonth() + 1);
    this.currentDate.set(d);
    const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    this.selectedDay.update(day => Math.min(day, maxDay));
  }

  selectDay(day: number | null): void {
    if (day !== null) {
      this.selectedDay.set(day);
    }
  }

  isToday(day: number | null): boolean {
    if (day === null) return false;
    const now = new Date();
    return day === now.getDate() &&
      this.currentDate().getMonth() === now.getMonth() &&
      this.currentDate().getFullYear() === now.getFullYear();
  }

  get selectedEvents(): CalendarEvent[] {
    return this.events()[this.selectedDay()] || [];
  }

  /** Abre el diálogo para crear un nuevo evento. */
  openAddDialog(): void {
    const dialogRef = this.dialog.open(CalendarEventDialogComponent, {
      data: this.buildDialogData(),
      panelClass: 'glass-dialog-overlay',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: CalendarEventData | null) => {
      if (!result) return;
      this.addEvent(result);
    });
  }

  private buildDialogData(event?: CalendarEvent): CalendarEventData {
    return {
      id: event?.id,
      title: event?.title || '',
      time: event?.time || '09:00',
      color: event?.color || EVENT_COLORS[0].value,
      description: event?.description || '',
      day: this.selectedDay(),
      month: this.currentDate().getMonth(),
      year: this.currentDate().getFullYear(),
    } as CalendarEventData;
  }

  /** Abre el diálogo para editar/eliminar un evento existente. */
  openEditDialog(event: CalendarEvent): void {
    const dialogRef = this.dialog.open(CalendarEventDialogComponent, {
      data: this.buildDialogData(event),
      panelClass: 'glass-dialog-overlay',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: CalendarEventData | { delete: boolean; id: string; day: number } | null) => {
      if (!result) return;

      if ('delete' in result && result.delete) {
        this.deleteEvent(result.id, result.day);
        return;
      }

      if ('title' in result) {
        this.updateEvent(result);
      }
    });
  }

  private addEvent(data: CalendarEventData): void {
    const newEvent: CalendarEvent = {
      id: `e${this.idCounter++}`,
      title: data.title,
      time: data.time,
      color: data.color,
      description: data.description || '',
    };

    this.events.update(evts => {
      const day = data.day;
      const existing = evts[day] ? [...evts[day]] : [];
      existing.push(newEvent);
      return { ...evts, [day]: existing };
    });

    this.notify.success('Evento creado', `"${newEvent.title}" agregado`);
  }

  private updateEvent(data: CalendarEventData): void {
    this.events.update(evts => {
      const day = data.day;
      const list = evts[day] ? [...evts[day]] : [];
      const idx = list.findIndex(e => e.id === data.id);
      if (idx !== -1) {
        list[idx] = {
          id: data.id!,
          title: data.title,
          time: data.time,
          color: data.color,
          description: data.description || '',
        };
      }
      return { ...evts, [day]: list };
    });

    this.notify.info('Evento actualizado', `"${data.title}" modificado`);
  }

  deleteEvent(id: string, day: number): void {
    const evt = this.events()[day]?.find(e => e.id === id);
    this.events.update(evts => {
      const list = (evts[day] || []).filter(e => e.id !== id);
      if (list.length === 0) {
        const next = { ...evts };
        delete next[day];
        return next;
      }
      return { ...evts, [day]: list };
    });

    this.notify.warning('Evento eliminado', evt ? `"${evt.title}" fue eliminado` : undefined);
  }
}
