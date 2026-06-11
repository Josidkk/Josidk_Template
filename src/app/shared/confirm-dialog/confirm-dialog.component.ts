import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="confirm-dialog" [ngClass]="data.type || 'danger'">
      <button class="dialog-close" (click)="onCancel()">
        <i class="ti ti-x"></i>
      </button>
      <div class="dialog-icon-wrap" [ngClass]="data.type || 'danger'">
        <div class="dialog-icon" [ngClass]="data.type || 'danger'">
          <i [class]="iconClass"></i>
        </div>
      </div>
      <h2 class="dialog-title">{{ data.title }}</h2>
      <p class="dialog-message">{{ data.message }}</p>
      <div class="dialog-actions">
        <button class="btn-cancel" (click)="onCancel()">{{ data.cancelText || 'Cancelar' }}</button>
        <button class="btn-confirm" [ngClass]="data.type || 'danger'" (click)="onConfirm()">
          <i *ngIf="data.type === 'danger'" class="ti ti-trash"></i>
          <i *ngIf="data.type === 'warning'" class="ti ti-alert-triangle"></i>
          <i *ngIf="data.type === 'info'" class="ti ti-check"></i>
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </div>
    </div>
  `,
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  data = inject(MAT_DIALOG_DATA) as ConfirmDialogData;
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  get iconClass(): string {
    switch (this.data.type) {
      case 'warning': return 'ti ti-alert-triangle';
      case 'info': return 'ti ti-info-circle';
      default: return 'ti ti-trash';
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}