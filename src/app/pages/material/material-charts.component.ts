import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-material-charts',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, BreadcrumbComponent],
  template: `
  <div class="mat-page">
    <app-breadcrumb
      [breadcrumbs]="breadcrumbs"
      pageTitle="Gráficas"
      icon="ti ti-chart-bar">
    </app-breadcrumb>

    <!-- Bar Chart -->
    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-chart-bar"></i></div>
        <div>
          <h2 class="section-title">Barras agrupadas</h2>
          <p class="section-subtitle">Comparativa de ingresos vs gastos mensuales</p>
        </div>
      </div>
      <div class="chart-container">
        <canvas baseChart
          [data]="barChartData"
          [options]="barChartOptions"
          [type]="'bar'"
          height="250">
        </canvas>
      </div>
      <div class="chart-legend-custom">
        <span class="legend-item-custom"><span class="legend-dot" style="background:var(--primary)"></span> Ingresos</span>
        <span class="legend-item-custom"><span class="legend-dot" style="background:var(--accent-warm)"></span> Gastos</span>
      </div>
    </section>

    <!-- Line Chart -->
    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-chart-line"></i></div>
        <div>
          <h2 class="section-title">Línea</h2>
          <p class="section-subtitle">Tendencia de usuarios nuevos vs recurrentes</p>
        </div>
      </div>
      <div class="chart-controls">
        <label class="toggle-label">
          <input type="checkbox" [ngModel]="lineFilled()" (ngModelChange)="lineFilled.set($event)">
          <span>Área rellena</span>
        </label>
        <label class="toggle-label">
          <input type="checkbox" [ngModel]="linePoints()" (ngModelChange)="linePoints.set($event)">
          <span>Mostrar puntos</span>
        </label>
      </div>
      <div class="chart-container">
        <canvas baseChart
          [data]="lineChartData"
          [options]="lineChartOptions"
          [type]="'line'"
          height="250">
        </canvas>
      </div>
    </section>

    <!-- Pie & Doughnut -->
    <div class="chart-row">
      <section class="mat-card-section card-3d chart-half">
        <div class="section-header">
          <div class="section-icon"><i class="ti ti-chart-pie"></i></div>
          <div>
            <h2 class="section-title">Pastel</h2>
            <p class="section-subtitle">Distribución por región</p>
          </div>
        </div>
        <div class="chart-container chart-container--sm">
          <canvas baseChart
            [data]="pieData"
            [options]="pieOptions"
            [type]="'pie'"
            height="240">
          </canvas>
        </div>
      </section>

      <section class="mat-card-section card-3d chart-half">
        <div class="section-header">
          <div class="section-icon"><i class="ti ti-chart-donut"></i></div>
          <div>
            <h2 class="section-title">Dona</h2>
            <p class="section-subtitle">Porcentaje del presupuesto</p>
          </div>
        </div>
        <div class="chart-container chart-container--sm">
          <canvas baseChart
            [data]="doughnutData"
            [options]="doughnutOptions"
            [type]="'doughnut'"
            height="240">
          </canvas>
        </div>
      </section>
    </div>

    <!-- Radar Chart -->
    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-radar"></i></div>
        <div>
          <h2 class="section-title">Radar</h2>
          <p class="section-subtitle">Comparativa de habilidades por equipo</p>
        </div>
      </div>
      <div class="chart-container">
        <canvas baseChart
          [data]="radarData"
          [options]="radarOptions"
          [type]="'radar'"
          height="260">
        </canvas>
      </div>
    </section>

    <!-- Polar Area -->
    <section class="mat-card-section card-3d">
      <div class="section-header">
        <div class="section-icon"><i class="ti ti-chart-donut-2"></i></div>
        <div>
          <h2 class="section-title">Polar</h2>
          <p class="section-subtitle">Ventas por categoría de producto</p>
        </div>
      </div>
      <div class="chart-container chart-container--sm">
        <canvas baseChart
          [data]="polarData"
          [options]="polarOptions"
          [type]="'polarArea'"
          height="260">
        </canvas>
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
      margin-bottom: 24px; padding-bottom: 18px;
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
    .chart-container {
      position: relative;
      canvas { width: 100% !important; max-height: 300px; }
    }
    .chart-container--sm {
      max-width: 360px; margin: 0 auto;
    }
    .chart-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
    }
    .chart-half { padding: 20px 24px; }
    .chart-legend-custom {
      display: flex; gap: 20px; justify-content: center; margin-top: 14px;
    }
    .legend-item-custom {
      display: flex; align-items: center; gap: 8px;
      font-size: 0.82rem; color: var(--text-secondary);
    }
    .legend-dot {
      width: 10px; height: 10px; border-radius: 3px;
      display: inline-block;
    }
    .chart-controls {
      display: flex; gap: 20px; margin-bottom: 16px; flex-wrap: wrap;
    }
    .toggle-label {
      display: flex; align-items: center; gap: 8px;
      font-size: 0.82rem; color: var(--text-secondary); cursor: pointer;
      input { accent-color: var(--primary); width: 16px; height: 16px; cursor: pointer; }
    }
    @media (max-width: 768px) {
      .chart-row { grid-template-columns: 1fr; }
    }
  `],
})
export class MaterialChartsComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Material UI', route: '/material' },
    { label: 'Gráficas' },
  ];

  /* ── CSS Variable helpers ── */
  /* ── Theme helpers (re-evaluated on each access via getters) ── */
  private get cssVars() {
    const s = typeof document !== 'undefined' ? getComputedStyle(document.documentElement) : null;
    const v = (name: string, fb: string) => s?.getPropertyValue(name)?.trim() || fb;
    return {
      primary: v('--primary', '#1A1208'),
      accentWarm: v('--accent-warm', '#C9C5BC'),
      textSecondary: v('--text-secondary', '#6B6258'),
      textMuted: v('--text-muted', '#A09A8E'),
      contentBg: v('--content-bg', '#FFFFFF'),
      cardBorder: v('--card-border', 'rgba(0,0,0,0.06)'),
    };
  }

  private get font(): string {
    return "'Plus Jakarta Sans', 'Inter', sans-serif";
  }

  private hexToRgba(hex: string, alpha: number): string {
    const c = hex.replace('#', '');
    return `rgba(${parseInt(c.substring(0,2),16)},${parseInt(c.substring(2,4),16)},${parseInt(c.substring(4,6),16)},${alpha})`;
  }

  /* ── Bar Chart ── */
  get barChartData(): ChartConfiguration<'bar'>['data'] {
    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [
        { data: [65, 59, 80, 81, 56, 72, 85, 92, 78, 88, 95, 102], label: 'Ingresos', borderRadius: 6, barThickness: 20, backgroundColor: this.cssVars.primary },
        { data: [28, 48, 40, 19, 36, 45, 52, 58, 48, 62, 70, 75], label: 'Gastos', borderRadius: 6, barThickness: 20, backgroundColor: this.cssVars.accentWarm },
      ],
    };
  }

  get barChartOptions(): ChartConfiguration<'bar'>['options'] {
    const c = this.cssVars;
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { font: { family: this.font, size: 11 }, color: c.textSecondary },
        },
        y: {
          beginAtZero: true,
          grid: { color: c.cardBorder, drawTicks: false },
          border: { display: false },
          ticks: { font: { family: this.font, size: 11 }, color: c.textMuted, padding: 8 },
        },
      },
    };
  }

  /* ── Line Chart ── */
  lineFilled = signal(true);
  linePoints = signal(true);

  private months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  get lineChartData(): ChartConfiguration<'line'>['data'] {
    const filled = this.lineFilled();
    const points = this.linePoints();
    const c = this.cssVars;
    const pri = c.primary, acc = c.accentWarm;
    return {
      labels: this.months,
      datasets: [
        {
          data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45],
          label: 'Nuevos',
          borderColor: pri,
          backgroundColor: filled ? this.hexToRgba(pri, 0.1) : 'transparent',
          fill: filled,
          pointRadius: points ? 4 : 0,
          pointBackgroundColor: pri,
          pointBorderColor: c.contentBg,
          pointBorderWidth: 2,
          tension: 0.4,
          borderWidth: 2.5,
        },
        {
          data: [8, 14, 10, 18, 16, 22, 20, 28, 24, 30, 26, 32],
          label: 'Recurrentes',
          borderColor: acc,
          backgroundColor: filled ? this.hexToRgba(acc, 0.1) : 'transparent',
          fill: filled,
          pointRadius: points ? 4 : 0,
          pointBackgroundColor: acc,
          pointBorderColor: c.contentBg,
          pointBorderWidth: 2,
          tension: 0.4,
          borderWidth: 2.5,
        },
      ],
    };
  }

  get lineChartOptions(): ChartConfiguration<'line'>['options'] {
    const c = this.cssVars;
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: { font: { family: this.font, size: 12 }, color: c.textSecondary, usePointStyle: true, padding: 16 },
        },
      },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { font: { family: this.font, size: 11 }, color: c.textSecondary } },
        y: { beginAtZero: true, grid: { color: c.cardBorder, drawTicks: false }, border: { display: false }, ticks: { font: { family: this.font, size: 11 }, color: c.textMuted, padding: 8 } },
      },
    };
  }

  /* ── Pie Chart ── */
  get pieData(): ChartConfiguration<'pie'>['data'] {
    const c = this.cssVars;
    return {
      labels: ['América', 'Europa', 'Asia', 'África', 'Oceanía'],
      datasets: [{
        data: [35, 25, 20, 12, 8],
        backgroundColor: ['#1A1208', '#D4940A', '#4ECDC4', '#A83828', '#6B6258'],
        borderColor: c.contentBg,
        borderWidth: 3,
      }],
    };
  }

  get pieOptions(): ChartConfiguration<'pie'>['options'] {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: this.font, size: 11 }, color: this.cssVars.textSecondary, usePointStyle: true, padding: 12 } },
      },
    };
  }

  /* ── Doughnut Chart ── */
  get doughnutData(): ChartConfiguration<'doughnut'>['data'] {
    const c = this.cssVars;
    return {
      labels: ['Marketing', 'Desarrollo', 'Infraestructura', 'Soporte', 'Admin'],
      datasets: [{
        data: [30, 25, 20, 15, 10],
        backgroundColor: [c.primary, '#D4940A', '#4ECDC4', '#A83828', c.accentWarm],
        borderColor: c.contentBg,
        borderWidth: 3,
      }],
    };
  }

  get doughnutOptions(): ChartConfiguration<'doughnut'>['options'] {
    return {
      responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: this.font, size: 11 }, color: this.cssVars.textSecondary, usePointStyle: true, padding: 12 } },
      },
    };
  }

  /* ── Radar Chart ── */
  get radarData(): ChartConfiguration<'radar'>['data'] {
    const c = this.cssVars;
    const pri = c.primary, acc = c.accentWarm;
    return {
      labels: ['UX', 'Frontend', 'Backend', 'DevOps', 'Data', 'QA'],
      datasets: [
        {
          data: [90, 75, 60, 45, 55, 70],
          label: 'Equipo A', borderColor: pri,
          backgroundColor: this.hexToRgba(pri, 0.15),
          pointBackgroundColor: pri, pointBorderColor: c.contentBg,
          pointBorderWidth: 2, pointRadius: 4,
        },
        {
          data: [65, 80, 85, 70, 60, 50],
          label: 'Equipo B', borderColor: acc,
          backgroundColor: this.hexToRgba(acc, 0.15),
          pointBackgroundColor: acc, pointBorderColor: c.contentBg,
          pointBorderWidth: 2, pointRadius: 4,
        },
      ],
    };
  }

  get radarOptions(): ChartConfiguration<'radar'>['options'] {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: true, labels: { font: { family: this.font, size: 12 }, color: this.cssVars.textSecondary, usePointStyle: true, padding: 16 } },
      },
      scales: {
        r: {
          beginAtZero: true,
          grid: { color: this.cssVars.cardBorder },
          angleLines: { color: this.cssVars.cardBorder },
          pointLabels: { font: { family: this.font, size: 11 }, color: this.cssVars.textSecondary },
          ticks: { display: false },
        },
      },
    };
  }

  /* ── Polar Area Chart ── */
  get polarData(): ChartConfiguration<'polarArea'>['data'] {
    const c = this.cssVars;
    return {
      labels: ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Juguetes'],
      datasets: [{
        data: [45, 32, 28, 22, 18, 15],
        backgroundColor: ['#1A1208', '#D4940A', '#4ECDC4', '#A83828', '#6B6258', '#2A7A44'],
        borderColor: c.contentBg,
        borderWidth: 3,
      }],
    };
  }

  get polarOptions(): ChartConfiguration<'polarArea'>['options'] {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: this.font, size: 11 }, color: this.cssVars.textSecondary, usePointStyle: true, padding: 12 } },
      },
      scales: { r: { grid: { color: this.cssVars.cardBorder }, ticks: { display: false } } },
    };
  }
}
