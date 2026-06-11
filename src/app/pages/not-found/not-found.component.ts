import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="not-found-wrapper">
      <div class="not-found-content">
        <span class="error-code">404</span>
        <h2 class="error-title">Página no encontrada</h2>
        <p class="error-desc">Lo sentimos, la página que buscas no existe o fue movida.</p>
        <a routerLink="/" class="btn-home">
          <i class="ti ti-home"></i>
          Volver al Inicio
        </a>
      </div>
    </div>
  `,
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {}
