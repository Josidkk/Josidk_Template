import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface InfoDialogData {
  title: string;
  message: string;
  icon?: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-info-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="info-dialog">
      <div class="info-dialog-glow"></div>
      <button class="info-dialog-close" (click)="onClose()">
        <i class="ti ti-x"></i>
      </button>

      <div class="info-dialog-icon-wrap">
        <div class="info-dialog-icon">
          <i [class]="data.icon || 'ti ti-info-circle'"></i>
        </div>
      </div>

      <h2 class="info-dialog-title">{{ data.title }}</h2>
      <p class="info-dialog-message">{{ data.message }}</p>

      <div class="info-dialog-actions">
        @if (data.cancelText) {
          <button class="info-btn-cancel" (click)="onClose()">{{ data.cancelText }}</button>
        }
        <button class="info-btn-confirm" (click)="onConfirm()">
          <i class="ti ti-check"></i>
          {{ data.confirmText || 'Entendido' }}
        </button>
      </div>
    </div>
  `,
  styleUrl: './info-dialog.component.scss',
})
export class InfoDialogComponent {
  data = inject(MAT_DIALOG_DATA) as InfoDialogData;
  private dialogRef = inject(MatDialogRef<InfoDialogComponent>);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}
