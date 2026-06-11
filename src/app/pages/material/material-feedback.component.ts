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
  template: `
  <div class="mat-page">
    <app-breadcrumb
      [breadcrumbs]="breadcrumbs"
      pageTitle="Feedback"
      icon="ti ti-bell-ringing">
    </app-breadcrumb>

    <!-- Progress Bars -->
    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-chart-bar"></i></div>
        <div>
          <h2 class="section-title">Barras de progreso</h2>
          <p class="section-subtitle">Modos determinada, indeterminada y buffer</p>
        </div>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Determinada <span class="value-hint">{{ progressValue() }}%</span></h4>
        <mat-progress-bar mode="determinate" [value]="progressValue()"></mat-progress-bar>
        <div class="progress-actions">
          <button mat-stroked-button (click)="startProgress()"><i class="ti ti-player-play"></i> Iniciar</button>
          <button mat-stroked-button (click)="resetProgress()"><i class="ti ti-refresh"></i> Reset</button>
        </div>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Indeterminada</h4>
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Buffer</h4>
        <mat-progress-bar mode="buffer" [value]="30" [bufferValue]="60"></mat-progress-bar>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Query mode</h4>
        <mat-progress-bar mode="query"></mat-progress-bar>
      </div>
    </section>

    <!-- Spinners -->
    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-loader"></i></div>
        <div>
          <h2 class="section-title">Spinners</h2>
          <p class="section-subtitle">Indicadores circulares de carga</p>
        </div>
      </div>
      <div class="spinner-grid">
        <div class="spinner-item">
          <mat-spinner diameter="32"></mat-spinner>
          <span>32px</span>
        </div>
        <div class="spinner-item">
          <mat-spinner diameter="48"></mat-spinner>
          <span>48px</span>
        </div>
        <div class="spinner-item">
          <mat-progress-spinner mode="determinate" [value]="25" diameter="48"></mat-progress-spinner>
          <span>25%</span>
        </div>
        <div class="spinner-item">
          <mat-progress-spinner mode="determinate" [value]="75" diameter="48"></mat-progress-spinner>
          <span>75%</span>
        </div>
        <div class="spinner-item">
          <mat-progress-spinner mode="determinate" [value]="100" diameter="48"></mat-progress-spinner>
          <span>Completo</span>
        </div>
      </div>
    </section>

    <!-- Snackbars -->
    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-bell-ringing"></i></div>
        <div>
          <h2 class="section-title">Notificaciones (Snackbar)</h2>
          <p class="section-subtitle">Mensajes temporales con estilo glass</p>
        </div>
      </div>
      <div class="btn-row">
        <button class="snack-btn success" (click)="showSuccess()">
          <i class="ti ti-circle-check"></i> Success
        </button>
        <button class="snack-btn error" (click)="showError()">
          <i class="ti ti-circle-x"></i> Error
        </button>
        <button class="snack-btn warning" (click)="showWarning()">
          <i class="ti ti-alert-triangle"></i> Warning
        </button>
        <button class="snack-btn info" (click)="showInfo()">
          <i class="ti ti-info-circle"></i> Info
        </button>
      </div>
    </section>
  </div>
  `,
  styles: [`
    .mat-page { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
    .mat-card-section {
      background: var(--content-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--content-radius);
      padding: 28px 32px;
    }
    .section-header {
      display: flex; align-items: center; gap: 16px;
      margin-bottom: 28px; padding-bottom: 20px;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    body.dark-theme .section-header { border-bottom-color: rgba(255,255,255,0.06); }
    .section-icon {
      width: 48px; height: 48px; border-radius: 14px;
      background: var(--primary-light); color: var(--primary);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      i { font-size: 1.4rem; }
    }
    .section-title {
      font-size: 1.1rem; font-weight: 700; color: var(--text-primary);
      margin: 0 0 2px;
    }
    .section-subtitle {
      font-size: 0.82rem; color: var(--text-secondary); margin: 0;
    }
    .demo-block { margin-bottom: 20px; &:last-child { margin-bottom: 0; } }
    .demo-label {
      font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);
      margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .value-hint { font-weight: 400; color: var(--text-muted); font-size: 0.75rem; }

    mat-progress-bar {
      --mdc-linear-progress-active-indicator-color: var(--primary) !important;
      --mdc-linear-progress-track-color: var(--primary-light) !important;
      border-radius: 4px !important; height: 6px !important;
    }
    .progress-actions { display: flex; gap: 8px; margin-top: 10px; }

    .spinner-grid {
      display: flex; gap: 24px; align-items: center; justify-content: center; flex-wrap: wrap;
    }
    .spinner-item {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      span { font-size: 0.72rem; color: var(--text-muted); font-weight: 500; }
    }
    mat-spinner, mat-progress-spinner {
      --mdc-circular-progress-active-indicator-color: var(--primary) !important;
    }

    .btn-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
    .snack-btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 20px; border-radius: 12px;
      font-size: 0.85rem; font-weight: 600; cursor: pointer;
      border: none; transition: all 0.2s; font-family: var(--font-family);
      i { font-size: 1rem; }
      &:hover { transform: translateY(-2px); }
      &.success {
        background: rgba(42,122,68,0.10); color: var(--success);
        border: 1px solid rgba(42,122,68,0.18);
        &:hover { background: rgba(42,122,68,0.16); box-shadow: 0 4px 14px rgba(42,122,68,0.15); }
      }
      &.error {
        background: rgba(168,56,40,0.10); color: var(--danger);
        border: 1px solid rgba(168,56,40,0.18);
        &:hover { background: rgba(168,56,40,0.16); box-shadow: 0 4px 14px rgba(168,56,40,0.15); }
      }
      &.warning {
        background: rgba(212,148,10,0.10); color: var(--warning);
        border: 1px solid rgba(212,148,10,0.18);
        &:hover { background: rgba(212,148,10,0.16); box-shadow: 0 4px 14px rgba(212,148,10,0.15); }
      }
      &.info {
        background: var(--primary-light); color: var(--primary);
        border: 1px solid var(--card-border);
        &:hover { background: color-mix(in srgb, var(--primary) 16%, transparent); box-shadow: 0 4px 14px color-mix(in srgb, var(--primary) 15%, transparent); }
      }
    }
    button[mat-stroked-button] {
      border-color: var(--card-border) !important; color: var(--text-primary) !important;
    }
  `],
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
