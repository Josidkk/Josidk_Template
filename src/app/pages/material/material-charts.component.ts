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
  templateUrl: './material-charts.component.html',
  styleUrl: './material-charts.component.scss',
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
