import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-material-data',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatBadgeModule, MatButtonModule, BreadcrumbComponent],
  template: `
  <div class="mat-page">
    <app-breadcrumb
      [breadcrumbs]="breadcrumbs"
      pageTitle="Visualización de datos"
      icon="ti ti-credit-card">
    </app-breadcrumb>

    <!-- Cards -->
    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-credit-card"></i></div>
        <div>
          <h2 class="section-title">Tarjetas (MatCard)</h2>
          <p class="section-subtitle">Contenedores con header, contenido y acciones</p>
        </div>
      </div>
      <div class="card-grid">
        <mat-card class="mat-card-demo" appearance="outlined">
          <mat-card-header>
            <div mat-card-avatar class="card-avatar">JD</div>
            <mat-card-title>Josidk ERP</mat-card-title>
            <mat-card-subtitle>Plantilla Angular 18</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Dashboard administrativo moderno con Angular Material, gráficas y componentes reutilizables.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button>ABRIR</button>
            <button mat-button>COMPARTIR</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="mat-card-demo" appearance="outlined">
          <mat-card-header>
            <div mat-card-avatar class="card-avatar">MT</div>
            <mat-card-title>Material Theming</mat-card-title>
            <mat-card-subtitle>Personalización visual</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Los colores, bordes y fondos se adaptan automáticamente a las variables CSS del tema.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button>VER</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </section>

    <!-- Chips -->
    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-tags"></i></div>
        <div>
          <h2 class="section-title">Chips</h2>
          <p class="section-subtitle">Etiquetas seleccionables con estilo temático</p>
        </div>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Selecciona tecnologías</h4>
        <div class="chip-row">
          @for (chip of chipList; track chip) {
            <mat-chip
              [class.mat-mdc-chip-selected]="isChipSelected(chip)"
              (click)="toggleChip(chip)">
              {{ chip }}
            </mat-chip>
          }
        </div>
        <p class="chip-hint">Seleccionados: {{ selectedChips.join(', ') || 'ninguno' }}</p>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Estilos de chip</h4>
        <div class="chip-row">
          <mat-chip [class.mat-mdc-chip-selected]="true">Angular</mat-chip>
          <mat-chip>React</mat-chip>
          <mat-chip>Vue</mat-chip>
          <mat-chip [class.mat-mdc-chip-selected]="true">Svelte</mat-chip>
        </div>
      </div>
    </section>

    <!-- Badges -->
    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-badge"></i></div>
        <div>
          <h2 class="section-title">Badges</h2>
          <p class="section-subtitle">Indicadores numéricos y de estado</p>
        </div>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Ejemplos de badges</h4>
        <div class="badge-row">
          <span [matBadge]="badgeCount()" [matBadgeHidden]="badgeHidden()" matBadgePosition="above after">Notificaciones</span>
          <span matBadge="!" matBadgeOverlap="false">Alerta</span>
          <span matBadge="New" matBadgeSize="large">Novedad</span>
          <span matBadge="99+" matBadgeSize="large">Mensajes</span>
        </div>
        <div class="badge-actions">
          <button mat-stroked-button (click)="decrementBadge()"><i class="ti ti-minus"></i></button>
          <button mat-stroked-button (click)="incrementBadge()"><i class="ti ti-plus"></i></button>
          <button mat-stroked-button (click)="toggleBadgeHidden()">{{ badgeHidden() ? 'Mostrar' : 'Ocultar' }}</button>
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
    .demo-block { margin-bottom: 20px; &:last-child { margin-bottom: 0; } }
    .demo-label {
      font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);
      margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .mat-card-demo {
      background: var(--content-bg) !important;
      border: 1px solid var(--card-border) !important;
      border-radius: 12px !important;
      .mat-mdc-card-header { padding: 14px 14px 0 !important; }
      .mat-mdc-card-title {
        font-size: 0.95rem !important; font-weight: 600 !important;
        color: var(--text-primary) !important;
      }
      .mat-mdc-card-subtitle {
        font-size: 0.78rem !important; color: var(--text-secondary) !important;
      }
      .mat-mdc-card-content { padding: 14px !important; }
      .mat-mdc-card-content p {
        font-size: 0.82rem; color: var(--text-secondary);
        margin: 0; line-height: 1.6;
      }
      .mat-mdc-card-actions { padding: 0 8px 8px !important; }
    }
    .card-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--primary); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 700;
    }
    .chip-row {
      display: flex; gap: 6px; flex-wrap: wrap;
    }
    .chip-hint {
      margin: 12px 0 0; font-size: 0.75rem; color: var(--text-muted);
    }
    mat-chip {
      cursor: pointer !important; font-size: 0.78rem !important;
      transition: all 0.15s !important;
      &.mat-mdc-chip-selected { background: var(--primary) !important; color: #fff !important; }
      &:not(.mat-mdc-chip-selected) { background: var(--primary-light) !important; color: var(--text-primary) !important; }
      &:hover { transform: translateY(-1px); }
    }
    .badge-row {
      display: flex; gap: 24px; align-items: center; padding: 8px 0; flex-wrap: wrap;
      > span { font-size: 0.85rem; font-weight: 500; color: var(--text-primary); }
    }
    .badge-actions {
      display: flex; gap: 8px; margin-top: 16px;
    }
    .mat-badge-content { background: var(--primary) !important; color: #fff !important; }
    button[mat-stroked-button] {
      border-color: var(--card-border) !important; color: var(--text-primary) !important;
    }
  `]
})
export class MaterialDataComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Material UI', route: '/material' },
    { label: 'Visualización' },
  ];

  chipList = ['Angular', 'Material', 'TypeScript', 'SCSS', 'Responsive'];
  selectedChips = ['Angular', 'Material'];

  toggleChip(chip: string): void {
    const idx = this.selectedChips.indexOf(chip);
    if (idx >= 0) this.selectedChips = this.selectedChips.filter(c => c !== chip);
    else this.selectedChips = [...this.selectedChips, chip];
  }

  isChipSelected(chip: string): boolean {
    return this.selectedChips.indexOf(chip) >= 0;
  }

  badgeHidden = signal(false);
  badgeCount = signal(7);

  decrementBadge(): void { this.badgeCount.update(v => Math.max(0, v - 1)); }
  incrementBadge(): void { this.badgeCount.update(v => v + 1); }
  toggleBadgeHidden(): void { this.badgeHidden.update(v => !v); }
}
