import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-material-inputs',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatSlideToggleModule, MatSliderModule, MatButtonModule,
    BreadcrumbComponent,
  ],
  template: `
  <div class="mat-page">
    <app-breadcrumb
      [breadcrumbs]="breadcrumbs"
      pageTitle="Inputs"
      icon="ti ti-toggle-left">
    </app-breadcrumb>

    <!-- Slide Toggles -->
    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-toggle-left"></i></div>
        <div>
          <h2 class="section-title">Slide Toggle</h2>
          <p class="section-subtitle">Interruptores de dos estados</p>
        </div>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Básico</h4>
        <mat-slide-toggle [ngModel]="toggleValue()" (ngModelChange)="toggleValue.set($event)">
          Modo {{ toggleValue() ? 'activado' : 'desactivado' }}
        </mat-slide-toggle>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Deshabilitado</h4>
        <mat-slide-toggle [checked]="true" [disabled]="true">Opción fija</mat-slide-toggle>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Etiqueta al inicio</h4>
        <mat-slide-toggle [checked]="true" labelPosition="before">Notificaciones</mat-slide-toggle>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Con color personalizado</h4>
        <mat-slide-toggle [checked]="true" color="primary">Color primario</mat-slide-toggle>
      </div>
    </section>

    <!-- Sliders -->
    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-adjustments-horizontal"></i></div>
        <div>
          <h2 class="section-title">Sliders</h2>
          <p class="section-subtitle">Selección de valor con rango</p>
        </div>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Valor único: <strong>{{ sliderValue() }}</strong></h4>
        <mat-slider min="0" max="100" step="1">
          <input matSliderThumb [ngModel]="sliderValue()" (ngModelChange)="sliderValue.set($event)">
        </mat-slider>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Incrementos de 10</h4>
        <mat-slider min="0" max="100" step="10" discrete>
          <input matSliderThumb [ngModel]="stepValue()" (ngModelChange)="stepValue.set($event)">
        </mat-slider>
        <span class="slider-hint">Valor: {{ stepValue() }}</span>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Rango: {{ rangeStart() }} — {{ rangeEnd() }}</h4>
        <mat-slider min="0" max="100" step="5">
          <input matSliderStartThumb [ngModel]="rangeStart()" (ngModelChange)="rangeStart.set($event)">
          <input matSliderEndThumb [ngModel]="rangeEnd()" (ngModelChange)="rangeEnd.set($event)">
        </mat-slider>
      </div>
      <div class="demo-block">
        <h4 class="demo-label">Vertical</h4>
        <mat-slider min="0" max="100" step="1" inverted vertical style="height: 150px;">
          <input matSliderThumb [ngModel]="vertValue()" (ngModelChange)="vertValue.set($event)">
        </mat-slider>
        <span class="slider-hint">Valor: {{ vertValue() }}</span>
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
      strong { color: var(--text-primary); }
    }
    .slider-hint {
      font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 4px;
    }

    mat-slide-toggle {
      font-size: 0.85rem !important; color: var(--text-primary) !important;
      --mdc-switch-selected-track-color: var(--primary) !important;
      --mdc-switch-selected-handle-color: #fff !important;
      --mdc-switch-unselected-track-color: var(--card-border) !important;
      --mdc-switch-unselected-handle-color: var(--text-muted) !important;
    }

    mat-slider {
      width: 100%; max-width: 400px;
      --mdc-slider-handle-color: var(--primary) !important;
      --mdc-slider-focus-handle-color: var(--primary) !important;
      --mdc-slider-active-track-color: var(--primary) !important;
      --mdc-slider-inactive-track-color: var(--primary-light) !important;
    }
  `],
})
export class MaterialInputsComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Material UI', route: '/material' },
    { label: 'Inputs' },
  ];

  toggleValue = signal(false);
  sliderValue = signal(50);
  stepValue = signal(30);
  rangeStart = signal(20);
  rangeEnd = signal(70);
  vertValue = signal(50);
}
