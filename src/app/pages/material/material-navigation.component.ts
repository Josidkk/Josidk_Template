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
  templateUrl: './material-navigation.component.html',
  styleUrl: './material-navigation.component.scss',
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
