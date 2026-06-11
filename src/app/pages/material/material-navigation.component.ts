import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';
import { NotificationService } from '../../core/services/notification.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-material-navigation',
  standalone: true,
  imports: [
    CommonModule, MatTabsModule, MatExpansionModule,
    MatButtonModule, MatTooltipModule, MatDividerModule,
    BreadcrumbComponent,
  ],
  template: `
  <div class="mat-page">
    <app-breadcrumb
      [breadcrumbs]="breadcrumbs"
      pageTitle="Navegación"
      icon="ti ti-navigation">
    </app-breadcrumb>

    <!-- Tabs -->
    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-navigation"></i></div>
        <div>
          <h2 class="section-title">Tabs</h2>
          <p class="section-subtitle">Navegación por pestañas</p>
        </div>
      </div>
      <mat-tab-group [(selectedIndex)]="tabIndex" class="tabs-demo">
        <mat-tab label="Dashboard">
          <div class="tab-content">
            <i class="ti ti-chart-bar"></i>
            <p>Panel con métricas, gráficos y estadísticas en tiempo real.</p>
          </div>
        </mat-tab>
        <mat-tab label="Usuarios">
          <div class="tab-content">
            <i class="ti ti-users"></i>
            <p>Gestión de usuarios con tabla editable y filtros avanzados.</p>
          </div>
        </mat-tab>
        <mat-tab label="Reportes">
          <div class="tab-content">
            <i class="ti ti-file-report"></i>
            <p>Reportes exportables con fechas personalizadas.</p>
          </div>
        </mat-tab>
        <mat-tab label="Configuración">
          <div class="tab-content">
            <i class="ti ti-settings"></i>
            <p>Ajustes del sistema, roles y permisos.</p>
          </div>
        </mat-tab>
      </mat-tab-group>
    </section>

    <!-- Expansion Panels -->
    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-arrows-vertical"></i></div>
        <div>
          <h2 class="section-title">Expansion Panels</h2>
          <p class="section-subtitle">Secciones colapsables con accordion</p>
        </div>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Panel simple <span class="value-hint">{{ panelExpanded() ? 'Expandido' : 'Colapsado' }}</span></h4>
        <mat-accordion class="expansion-demo">
          <mat-expansion-panel (opened)="panelExpanded.set(true)" (closed)="panelExpanded.set(false)" hideToggle>
            <mat-expansion-panel-header>
              <mat-panel-title>Configuración básica</mat-panel-title>
              <mat-panel-description>Ajustes principales</mat-panel-description>
            </mat-expansion-panel-header>
            <p>Aquí puedes ajustar los parámetros principales de tu aplicación.</p>
            <mat-action-row>
              <button mat-button (click)="panelExpanded.set(false)">Cerrar</button>
            </mat-action-row>
          </mat-expansion-panel>
        </mat-accordion>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Wizard multi-paso</h4>
        <mat-accordion class="expansion-demo">
          <mat-expansion-panel [expanded]="step() === 0" (opened)="setStep(0)">
            <mat-expansion-panel-header>
              <mat-panel-title>Paso 1</mat-panel-title>
              <mat-panel-description>Información general</mat-panel-description>
            </mat-expansion-panel-header>
            <p>Completa los datos básicos del formulario.</p>
            <mat-action-row>
              <button mat-button (click)="nextStep()">Siguiente</button>
            </mat-action-row>
          </mat-expansion-panel>
          <mat-expansion-panel [expanded]="step() === 1" (opened)="setStep(1)">
            <mat-expansion-panel-header>
              <mat-panel-title>Paso 2</mat-panel-title>
              <mat-panel-description>Configuración avanzada</mat-panel-description>
            </mat-expansion-panel-header>
            <p>Define las opciones específicas del módulo.</p>
            <mat-action-row>
              <button mat-button (click)="prevStep()">Anterior</button>
              <button mat-button (click)="nextStep()">Siguiente</button>
            </mat-action-row>
          </mat-expansion-panel>
          <mat-expansion-panel [expanded]="step() === 2" (opened)="setStep(2)">
            <mat-expansion-panel-header>
              <mat-panel-title>Paso 3</mat-panel-title>
              <mat-panel-description>Revisión final</mat-panel-description>
            </mat-expansion-panel-header>
            <p>Verifica que todo esté correcto antes de finalizar.</p>
            <mat-action-row>
              <button mat-button (click)="setStep(0)">Reiniciar</button>
              <button mat-button (click)="prevStep()">Anterior</button>
              <button mat-raised-button (click)="completeWizard()">Finalizar</button>
            </mat-action-row>
          </mat-expansion-panel>
        </mat-accordion>
      </div>
    </section>

    <!-- Tooltips & Dividers -->
    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-info-circle"></i></div>
        <div>
          <h2 class="section-title">Tooltips & Divisores</h2>
          <p class="section-subtitle">Información contextual y separadores</p>
        </div>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Posiciones</h4>
        <div class="tooltip-row">
          <button mat-button matTooltip="Tooltip arriba" matTooltipPosition="above">Arriba</button>
          <button mat-button matTooltip="Tooltip abajo" matTooltipPosition="below">Abajo</button>
          <button mat-button matTooltip="Tooltip izquierda" matTooltipPosition="left">Izquierda</button>
          <button mat-button matTooltip="Tooltip derecha" matTooltipPosition="right">Derecha</button>
        </div>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Con delay</h4>
        <div class="tooltip-row">
          <button mat-button matTooltip="Aparece en 1s" [matTooltipShowDelay]="1000">Delay 1s</button>
          <button mat-button matTooltip="Se oculta en 2s" [matTooltipHideDelay]="2000">Hide 2s</button>
          <span class="tooltip-text" matTooltip="Texto con tooltip">Pasa el mouse aquí</span>
        </div>
      </div>
      <mat-divider class="kit-divider"></mat-divider>
      <p class="divider-note">Los divisores separan secciones de contenido de forma elegante y visual.</p>
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

    :host ::ng-deep .tabs-demo {
      .mat-mdc-tab-header { border-bottom: 1px solid var(--card-border) !important; }
      .mat-mdc-tab { font-size: 0.85rem !important; font-weight: 500 !important; }
      .mat-mdc-tab.mdc-tab--active .mdc-tab__text-label { color: var(--primary) !important; }
      .mat-mdc-tab .mdc-tab__text-label { color: var(--text-secondary) !important; }
      .mat-mdc-tab-indicator { --mdc-tab-indicator-active-indicator-color: var(--primary) !important; }
      .mat-mdc-tab-body-content { padding: 20px 4px !important; }
    }
    .tab-content {
      display: flex; flex-direction: column; align-items: center; gap: 10px;
      padding: 20px; text-align: center;
      i { font-size: 2.2rem; color: var(--primary); opacity: 0.3; }
      p { font-size: 0.85rem; color: var(--text-secondary); margin: 0; max-width: 300px; line-height: 1.6; }
    }

    :host ::ng-deep .expansion-demo {
      .mat-expansion-panel {
        background: var(--content-bg) !important;
        border: 1px solid var(--card-border) !important;
        border-radius: 10px !important; margin-bottom: 8px !important;
        &:not([class*=mat-elevation-z]) { box-shadow: none !important; }
      }
      .mat-expansion-panel-header {
        padding: 0 16px !important; font-size: 0.85rem !important;
        .mat-expansion-panel-header-title { color: var(--text-primary) !important; font-weight: 600 !important; font-size: 0.85rem !important; }
        .mat-expansion-panel-header-description { color: var(--text-secondary) !important; font-size: 0.78rem !important; }
      }
      .mat-expansion-panel-body {
        padding: 0 16px 16px !important; font-size: 0.82rem !important;
        color: var(--text-secondary) !important; line-height: 1.6 !important;
      }
      .mat-action-row { border-top-color: var(--card-border) !important; padding: 12px 8px 8px !important; }
    }

    .tooltip-row {
      display: flex; gap: 10px; flex-wrap: wrap; align-items: center;
    }
    .tooltip-text {
      font-size: 0.82rem; color: var(--text-secondary);
      border-bottom: 1px dashed var(--card-border); cursor: help; padding: 4px 0;
    }
    :host ::ng-deep .kit-divider { margin: 8px 0 !important; border-top-color: var(--card-border) !important; }
    .divider-note { font-size: 0.78rem; color: var(--text-muted); margin: 4px 0 0; font-style: italic; }

    button[mat-button] { color: var(--text-primary) !important; }
    button[mat-raised-button] { background: var(--primary) !important; color: #fff !important; }
  `],
})
export class MaterialNavigationComponent {
  private notify = inject(NotificationService);
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Material UI', route: '/material' },
    { label: 'Navegación' },
  ];

  tabIndex = signal(0);
  panelExpanded = signal(false);
  step = signal(0);

  setStep(value: number): void { this.step.set(value); }
  nextStep(): void { this.step.update(v => Math.min(v + 1, 2)); }
  prevStep(): void { this.step.update(v => Math.max(v - 1, 0)); }
  completeWizard(): void {
    this.notify.success('Proceso completado correctamente');
    this.step.set(0);
  }
}
