import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface CalendarEventData {
  id?: string;
  title: string;
  time: string;
  color: string;
  description: string;
  day: number;
  month?: number;
  year?: number;
}

export const EVENT_COLORS = [
  { value: '#3b82f6', label: 'Azul' },
  { value: '#22c55e', label: 'Verde' },
  { value: '#8b5cf6', label: 'Púrpura' },
  { value: '#f59e0b', label: 'Naranja' },
  { value: '#ef4444', label: 'Rojo' },
  { value: '#ec4899', label: 'Rosa' },
  { value: '#14b8a6', label: 'Teal' },
  { value: '#64748b', label: 'Pizarra' },
];

@Component({
  selector: 'app-calendar-event-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, MatDialogModule],
  template: `
    <div class="calendar-event-dialog">
      <!-- Header -->
      <div class="ced-header">
        <div class="ced-header-icon">
          <i class="ti ti-calendar-event"></i>
        </div>
        <div>
          <h2>{{ data.id ? 'Editar evento' : 'Nuevo evento' }}</h2>
          <p>{{ monthName }}, día {{ data.day }}</p>
        </div>
        <button class="ced-close" (click)="cancel()">
          <i class="ti ti-x"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="ced-body">
        <!-- Title -->
        <div class="ced-field">
          <label class="ced-label">Título del evento</label>
          <input
            class="ced-input"
            type="text"
            placeholder="Ej: Reunión de equipo"
            [(ngModel)]="form.title"
            #titleInput="ngModel"
            required>
          @if (titleInput.invalid && titleInput.touched) {
            <span class="ced-error">El título es obligatorio</span>
          }
        </div>

        <!-- Date & Time -->
        <div class="ced-row">
          <div class="ced-field">
            <label class="ced-label">Fecha</label>
            <input class="ced-input" type="date" [(ngModel)]="form.date">
          </div>
          <div class="ced-field">
            <label class="ced-label">Hora</label>
            <input class="ced-input" type="time" [(ngModel)]="form.time">
          </div>
        </div>

        <!-- Color -->
        <div class="ced-field">
          <label class="ced-label">Color del evento</label>
          <div class="ced-colors">
            @for (color of colors; track color.value) {
              <button
                class="ced-color-btn"
                [class.selected]="form.color === color.value"
                [style.background]="color.value"
                [title]="color.label"
                (click)="form.color = color.value">
                @if (form.color === color.value) {
                  <i class="ti ti-check"></i>
                }
              </button>
            }
          </div>
        </div>

        <!-- Description -->
        <div class="ced-field">
          <label class="ced-label">Descripción <span class="ced-optional">(opcional)</span></label>
          <textarea
            class="ced-textarea"
            placeholder="Añade una descripción..."
            rows="3"
            [(ngModel)]="form.description"></textarea>
        </div>
      </div>

      <!-- Footer -->
      <div class="ced-footer">
        <button class="ced-btn ced-btn-cancel" (click)="cancel()">Cancelar</button>
        @if (data.id) {
          <button class="ced-btn ced-btn-delete" (click)="delete()">
            <i class="ti ti-trash"></i> Eliminar
          </button>
        }
        <button
          class="ced-btn ced-btn-save"
          (click)="save()"
          [disabled]="!form.title.trim()">
          <i class="ti ti-device-floppy"></i>
          {{ data.id ? 'Guardar cambios' : 'Crear evento' }}
        </button>
      </div>
    </div>
  `,
  styleUrl: './calendar-event-dialog.component.scss',
})
export class CalendarEventDialogComponent {
  private dialogRef = inject(MatDialogRef<CalendarEventDialogComponent>);
  data = inject(MAT_DIALOG_DATA) as CalendarEventData;

  colors = EVENT_COLORS;

  form: {
    title: string;
    date: string;
    time: string;
    color: string;
    description: string;
  };

  /** Nombre del mes formateado para el header. */
  get monthName(): string {
    if (!this.form.date) return '';
    const d = new Date(this.form.date + 'T12:00:00');
    return d.toLocaleDateString('es-ES', { month: 'long' });
  }

  constructor() {
    const dayStr = String(this.data.day).padStart(2, '0');
    const monthStr = String((this.data.month ?? new Date().getMonth()) + 1).padStart(2, '0');
    const year = this.data.year ?? new Date().getFullYear();
    // Build a date string from the day + viewed month/year
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    this.form = {
      title: this.data.title || '',
      date: dateStr,
      time: this.data.time || '09:00',
      color: this.data.color || EVENT_COLORS[0].value,
      description: this.data.description || '',
    };
  }

  save(): void {
    if (!this.form.title.trim()) return;
    this.dialogRef.close({
      ...this.form,
      day: this.data.day,
      id: this.data.id,
    } as CalendarEventData);
  }

  delete(): void {
    this.dialogRef.close({ delete: true, id: this.data.id, day: this.data.day });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
