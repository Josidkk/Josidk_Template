import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from './core/config/app-config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly title = APP_CONFIG.siteFullName;

  constructor() {
    inject(Title).setTitle(APP_CONFIG.siteFullName);
  }
}
