import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export interface SnackbarData {
  type: 'success' | 'error' | 'warning' | 'info' | 'purple' | 'neutral';
  title: string;
  description?: string;
  action?: string;
}

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="snackbar-container" [ngClass]="'snackbar-' + data.type">
      <!-- Icon -->
      <div class="snackbar-icon" [ngClass]="'icon-' + data.type">
        <i [ngClass]="getIcon()"></i>
      </div>

      <!-- Body -->
      <div class="snackbar-body">
        <div class="snackbar-title">{{ data.title }}</div>
        <div class="snackbar-desc" *ngIf="data.description">
          {{ data.description }}
        </div>
      </div>

      <!-- Action button -->
      <button
        class="snackbar-action"
        [ngClass]="'act-' + data.type"
        *ngIf="data.action"
        (click)="onAction()"
      >
        {{ data.action }}
      </button>

      <!-- Close button -->
      <button
        class="snackbar-close"
        aria-label="Cerrar"
        (click)="onClose()"
      >
        <i class="ti ti-x"></i>
      </button>

      <!-- Progress bar -->
      <div class="progress-bar" [ngClass]="'prog-' + data.type"></div>
    </div>
  `,
  styleUrl: './custom-snackbar.component.scss',
})
export class CustomSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData,
    private snackBarRef: MatSnackBarRef<CustomSnackbarComponent>
  ) {}

  getIcon(): string {
    const icons: { [key: string]: string } = {
      success: 'ti ti-check',
      error: 'ti ti-alert-circle',
      warning: 'ti ti-alert-triangle',
      info: 'ti ti-info-circle',
      purple: 'ti ti-sparkles',
      neutral: 'ti ti-copy',
    };
    return icons[this.data.type] || 'ti ti-info-circle';
  }

  onAction(): void {
    this.snackBarRef.dismissWithAction();
  }

  onClose(): void {
    this.snackBarRef.dismiss();
  }
}
