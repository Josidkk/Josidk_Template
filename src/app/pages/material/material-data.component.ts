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
  templateUrl: './material-data.component.html',
  styleUrl: './material-data.component.scss'
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
