import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ComposeEmailData {
  to: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-compose-email-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, MatDialogModule],
  template: `
    <div class="compose-email-dialog">
      <!-- Header -->
      <div class="ced-header-comp">
        <div class="ced-header-left">
          <div class="ced-header-icon">
            <i class="ti ti-pencil"></i>
          </div>
          <div>
            <h2>Nuevo mensaje</h2>
          </div>
        </div>
        <button class="ced-close" (click)="cancel()">
          <i class="ti ti-x"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="ced-body-comp">
        <!-- To -->
        <div class="ced-field-comp">
          <label class="ced-label-comp">Para</label>
          <input
            class="ced-input-comp"
            type="text"
            placeholder="ej: usuario@correo.com"
            [(ngModel)]="form.to"
            #toInput="ngModel"
            required>
          @if (toInput.invalid && toInput.touched) {
            <span class="ced-error-comp">El destinatario es obligatorio</span>
          }
        </div>

        <!-- Subject -->
        <div class="ced-field-comp">
          <label class="ced-label-comp">Asunto</label>
          <input
            class="ced-input-comp"
            type="text"
            placeholder="¿De qué se trata?"
            [(ngModel)]="form.subject"
            #subjectInput="ngModel"
            required>
          @if (subjectInput.invalid && subjectInput.touched) {
            <span class="ced-error-comp">El asunto es obligatorio</span>
          }
        </div>

        <!-- Message -->
        <div class="ced-field-comp ced-field-message">
          <label class="ced-label-comp">Mensaje</label>
          <textarea
            class="ced-textarea-comp"
            placeholder="Escribe tu mensaje aquí..."
            rows="8"
            [(ngModel)]="form.message"
            #msgInput="ngModel"
            required></textarea>
          @if (msgInput.invalid && msgInput.touched) {
            <span class="ced-error-comp">El mensaje no puede estar vacío</span>
          }
        </div>

        <!-- Quick suggestions -->
        <div class="ced-suggestions">
          <span class="ced-suggestions-label">Contactos rápidos:</span>
          @for (contact of quickContacts; track contact.email) {
            <button class="ced-chip" (click)="setTo(contact.email)">
              <i class="ti ti-user"></i> {{ contact.name }}
            </button>
          }
        </div>
      </div>

      <!-- Footer -->
      <div class="ced-footer-comp">
        <button class="ced-btn-comp ced-btn-cancel" (click)="cancel()">
          <i class="ti ti-x"></i> Descartar
        </button>
        <button
          class="ced-btn-comp ced-btn-send"
          (click)="send()"
          [disabled]="!form.to.trim() || !form.subject.trim() || !form.message.trim()">
          <i class="ti ti-send"></i> Enviar
        </button>
      </div>
    </div>
  `,
  styleUrl: './compose-email-dialog.component.scss',
})
export class ComposeEmailDialogComponent {
  private dialogRef = inject(MatDialogRef<ComposeEmailDialogComponent>);

  form: ComposeEmailData = {
    to: '',
    subject: '',
    message: '',
  };

  quickContacts = [
    { name: 'María García', email: 'maria@empresa.com' },
    { name: 'Carlos López', email: 'carlos@empresa.com' },
    { name: 'Ana Martínez', email: 'ana@empresa.com' },
  ];

  setTo(email: string): void {
    this.form.to = email;
  }

  send(): void {
    if (!this.form.to.trim() || !this.form.subject.trim() || !this.form.message.trim()) return;
    this.dialogRef.close({ ...this.form });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
