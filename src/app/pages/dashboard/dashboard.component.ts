import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  selectedYear = '2026';

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Buenos días';
    if (hour >= 12 && hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  get greetingEmoji(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return '☀️';
    if (hour >= 12 && hour < 18) return '🌤️';
    return '🌙';
  }

  barChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        data: [45, 52, 38, 65, 48, 72, 58, 85, 62, 78, 68, 92],
        backgroundColor: 'rgba(15, 15, 14, 0.85)',
        borderRadius: 6,
        barThickness: 20,
      },
      {
        data: [35, 42, 28, 55, 38, 62, 48, 75, 52, 68, 58, 82],
        backgroundColor: 'rgba(201, 197, 188, 0.5)',
        borderRadius: 6,
        barThickness: 20,
      }
    ],
  };

  barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
          color: 'rgba(0, 0, 0, 0.38)',
        },
      },
      y: {
        display: false,
        grid: { display: false },
      },
    },
  };

  doughnutChartData = {
    labels: ['América', 'Asia', 'Europa'],
    datasets: [
      {
        data: [1650, 350, 458],
        backgroundColor: ['#0F0F0E', '#E9A23B', '#4ECDC4'],
        borderWidth: 3,
        borderColor: '#FDFAF5',
      },
    ],
  };

  doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
    },
  };

}
