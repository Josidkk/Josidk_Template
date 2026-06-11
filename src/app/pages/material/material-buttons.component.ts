import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-material-buttons',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTooltipModule, BreadcrumbComponent],
  template: `
  <div class="mat-page">
    <app-breadcrumb
      [breadcrumbs]="breadcrumbs"
      pageTitle="Botones"
      icon="ti ti-components">
    </app-breadcrumb>

    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-components"></i></div>
        <div>
          <h2 class="section-title">Botones Material</h2>
          <p class="section-subtitle">Todas las variantes de botones de Angular Material</p>
        </div>
      </div>

      <div class="demo-block">
        <h4 class="demo-label">Botones básicos</h4>
        <div class="btn-row">
          <button mat-button>Basic</button>
          <button mat-raised-button>Raised</button>
          <button mat-stroked-button>Stroked</button>
          <button mat-flat-button>Flat</button>
        </div>
      </div>

      <div class="demo-block">
        <h4 class="demo-label">Botones con icono</h4>
        <div class="btn-row">
          <button mat-icon-button matTooltip="Icon button"><i class="ti ti-star"></i></button>
          <button mat-icon-button matTooltip="Settings"><i class="ti ti-settings"></i></button>
          <button mat-icon-button matTooltip="Delete"><i class="ti ti-trash"></i></button>
          <button mat-icon-button matTooltip="Edit"><i class="ti ti-edit"></i></button>
        </div>
      </div>

      <div class="demo-block">
        <h4 class="demo-label">FAB (Floating Action Buttons)</h4>
        <div class="btn-row">
          <button mat-mini-fab matTooltip="Mini FAB"><i class="ti ti-plus"></i></button>
          <button mat-fab matTooltip="FAB"><i class="ti ti-plus"></i></button>
          <button mat-fab extended matTooltip="Extended FAB"><i class="ti ti-send"></i> Enviar</button>
        </div>
      </div>

      <div class="demo-block">
        <h4 class="demo-label">Estados</h4>
        <div class="btn-row">
          <button mat-raised-button [disabled]="true">Deshabilitado</button>
          <button mat-stroked-button color="primary">Primario</button>
          <button mat-raised-button color="primary">Primario</button>
        </div>
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
    .demo-block { margin-bottom: 20px; }
    .demo-label {
      font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);
      margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .btn-row {
      display: flex; gap: 12px; flex-wrap: wrap; align-items: center;
    }
    button[mat-raised-button], button[mat-flat-button] {
      background: var(--primary) !important; color: #fff !important;
    }
    button[mat-stroked-button] {
      border-color: var(--card-border) !important; color: var(--text-primary) !important;
    }
    button[mat-icon-button] { color: var(--text-primary) !important; }
    button[mat-mini-fab], button[mat-fab] {
      background: var(--primary) !important; color: #fff !important;
    }
  `]
})
export class MaterialButtonsComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Material UI', route: '/material' },
    { label: 'Botones' },
  ];
}
