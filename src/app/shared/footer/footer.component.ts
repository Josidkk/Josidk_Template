import { Component, ChangeDetectionStrategy } from '@angular/core';
import { APP_CONFIG } from '../../core/config/app-config';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  readonly siteName = APP_CONFIG.siteFullName;
  readonly currentYear = new Date().getFullYear();
}
