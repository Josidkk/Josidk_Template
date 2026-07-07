import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-material-buttons',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTooltipModule, BreadcrumbComponent],
  templateUrl: './material-buttons.component.html',
  styleUrl: './material-buttons.component.scss'
})
export class MaterialButtonsComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Material UI', route: '/material' },
    { label: 'Botones' },
  ];
}
