import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-material-feedback',
  standalone: true,
  imports: [
    CommonModule, MatProgressBarModule, MatProgressSpinnerModule,
    MatButtonModule, MatSnackBarModule, BreadcrumbComponent,
  ],
  templateUrl: './material-feedback.component.html',
  styleUrl: './material-feedback.component.scss',
})
export class MaterialFeedbackComponent {
  private notify = inject(NotificationService);
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Material UI', route: '/material' },
    { label: 'Feedback' },
  ];

  progressValue = signal(0);
  private progressInterval: ReturnType<typeof setInterval> | null = null;

  startProgress(): void {
    if (this.progressInterval) return;
    this.progressValue.set(0);
    this.progressInterval = setInterval(() => {
      this.progressValue.update(v => {
        if (v >= 100) { this.stopProgress(); return 100; }
        return v + 5;
      });
    }, 300);
  }

  stopProgress(): void {
    if (this.progressInterval) { clearInterval(this.progressInterval); this.progressInterval = null; }
  }

  resetProgress(): void { this.stopProgress(); this.progressValue.set(0); }

  showSuccess(): void { this.notify.success('Operación completada correctamente'); }
  showError(): void { this.notify.error('Ocurrió un error al procesar la solicitud'); }
  showWarning(): void { this.notify.warning('Tu sesión expirará en 5 minutos'); }
  showInfo(): void { this.notify.info('Sincronizando datos con el servidor...'); }
}
