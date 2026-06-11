import { Component, ChangeDetectionStrategy, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  isSidebarCollapsed = signal(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  private router = inject(Router);
  private routerSub!: Subscription;

  ngOnInit() {
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        this.isSidebarCollapsed.set(true);
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  /* ── Swipe gesture for mobile ── */
  private touchStartX = 0;
  private touchStartY = 0;

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent): void {
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    const deltaY = event.changedTouches[0].clientY - this.touchStartY;
    const threshold = 60;

    // Solo swipes horizontales (ignorar scroll vertical)
    if (Math.abs(deltaX) < Math.abs(deltaY) * 1.5) return;

    if (this.isSidebarCollapsed() && deltaX > threshold && this.touchStartX < 40) {
      // Swipe right desde el borde izquierdo → abrir sidebar
      this.isSidebarCollapsed.set(false);
    } else if (!this.isSidebarCollapsed() && deltaX < -threshold) {
      // Swipe left → cerrar sidebar
      this.isSidebarCollapsed.set(true);
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }
}
