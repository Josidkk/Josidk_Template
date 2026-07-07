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
  templateUrl: './material-inputs.component.html',
  styleUrl: './material-inputs.component.scss',
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
