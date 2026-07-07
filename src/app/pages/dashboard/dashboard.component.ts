import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { APP_CONFIG } from '../../core/config/app-config';
import { MOCK_BAR_CHART_DATA, MOCK_DOUGHNUT_CHART_DATA } from './dashboard.mock';

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

  get userName(): string {
    return APP_CONFIG.user.name.split(' ')[0];
  }

  private morningPhrases = [
    'Que tengas un dia productivo. Estas son tus metricas de hoy.',
    'Arrancando el dia con todo. Aqui tienes el resumen ejecutivo.',
    'Buenos dias. El dashboard ya esta listo para ti.',
    'Hoy es un gran dia para hacer crecer el negocio. Revisa las cifras.',
    'La energia de la manana impulsa grandes resultados. Veamos los numeros.',
    'Un nuevo dia, nuevas oportunidades. Esto es lo que importa hoy.',
    'El cafe y los datos son la mejor combinacion. Aqui van los tuyos.',
  ];

  private afternoonPhrases = [
    'Sigue asi. Esto es lo que llevamos en el dia.',
    'La tarde avanza y los numeros hablan. Aqui tienes el panorama.',
    'Buenas tardes. Revisa como van las metricas clave.',
    'La jornada sigue en marcha. Manten el rumbo con estos datos.',
    'Todo va sobre ruedas. Este es el resumen de la tarde.',
    'Sigue empujando. Los resultados de hoy se ven prometedores.',
    'La tarde es perfecta para ajustar la estrategia. Aqui estan los numeros.',
  ];

  private eveningPhrases = [
    'Buenas noches. Aqui tienes el cierre del dia.',
    'El dia termina, pero los datos quedan. Revisa el resumen final.',
    'Jornada completada. Veamos como fue el rendimiento de hoy.',
    'Hora de hacer balance. Estas son las cifras del dia.',
    'El dia fue intenso. Aqui tienes todo lo que necesitas saber.',
    'Buen cierre. Revisa las metricas antes de desconectar.',
    'La noche trae calma y claridad. Aprovecha para analizar los resultados.',
  ];

  get greetingIcon(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'ti-sun';
    if (hour >= 12 && hour < 18) return 'ti-cloud-sun';
    return 'ti-moon';
  }

  greetingPhrase: string;

  constructor() {
    this.greetingPhrase = this.pickRandomPhrase();
  }

  private pickRandomPhrase(): string {
    const hour = new Date().getHours();
    let pool: string[];
    if (hour >= 5 && hour < 12) pool = this.morningPhrases;
    else if (hour >= 12 && hour < 18) pool = this.afternoonPhrases;
    else pool = this.eveningPhrases;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  barChartData = MOCK_BAR_CHART_DATA;

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

  doughnutChartData = MOCK_DOUGHNUT_CHART_DATA;

  doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
    },
  };

}
