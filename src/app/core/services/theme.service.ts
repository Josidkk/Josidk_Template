import { Injectable, signal, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Centralized theme management service.
 * Uses Angular signals for reactive state and persists preference to localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Reactive signal exposing current dark-mode state. */
  readonly isDark = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Hydrate from localStorage on init
      const saved = localStorage.getItem('josidk-theme');
      if (saved === 'dark') {
        this.isDark.set(true);
        document.body.classList.add('dark-theme');
      }

      // Sync signal → DOM + localStorage whenever it changes
      effect(() => {
        const dark = this.isDark();
        if (isPlatformBrowser(this.platformId)) {
          document.body.classList.toggle('dark-theme', dark);
          localStorage.setItem('josidk-theme', dark ? 'dark' : 'light');
        }
      });
    }
  }

  /** Toggle between light and dark themes. */
  toggle(): void {
    this.isDark.update(v => !v);
  }

  /** Explicitly set the theme. */
  setDark(dark: boolean): void {
    this.isDark.set(dark);
  }
}
