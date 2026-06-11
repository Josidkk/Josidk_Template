import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarConfigService } from '../../core/services/sidebar-config.service';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  badge?: string;
  children?: MenuItem[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  private router = inject(Router);
  private sidebarConfig = inject(SidebarConfigService);

  /** Secciones filtradas: solo las que no están ocultas en la configuración */
  visibleSections = computed(() =>
    this.menuSections.filter(s => this.sidebarConfig.isSectionVisible(s.title))
  );

  activeItem = signal('dashboard');
  expandedItems = signal<Set<string>>(new Set());

  user = {
    name: 'Deyby Josue',
    role: 'Developer',
    initials: 'DJ',
    avatarUrl: null as string | null,
  };

  menuSections: MenuSection[] = [
    {
      title: 'Dashboards',
      items: [
        { id: 'dashboard', label: 'Analytics', icon: 'ti ti-chart-bar', route: '/dashboard' },
        { id: 'ecommerce', label: 'eCommerce', icon: 'ti ti-shopping-bag', route: '/ecommerce' },
      ]
    },
    {
      title: 'Apps',
      items: [
        { id: 'chat', label: 'Chat', icon: 'ti ti-message-2', route: '/chat' },
        { id: 'calendar', label: 'Calendario', icon: 'ti ti-calendar', route: '/calendar' },
        { id: 'email', label: 'Email', icon: 'ti ti-mail', route: '/email' },
        { id: 'kanban', label: 'Kanban', icon: 'ti ti-layout-kanban', route: '/kanban' },
        { id: 'profile', label: 'Perfil', icon: 'ti ti-user-circle', route: '/profile', badge: 'new' },
      ]
    },
    {
      title: 'Gestión',
      items: [
        { id: 'usuarios', label: 'Empleados', icon: 'ti ti-users', route: '/users' },
        { id: 'settings', label: 'Configuración', icon: 'ti ti-settings-2', route: '/settings' },
        { id: 'ui-components', label: 'UI Components', icon: 'ti ti-palette', route: '/ui-components' },
      ]
    },
    {
      title: 'Material UI',
      items: [
        { id: 'mat-buttons', label: 'Botones', icon: 'ti ti-components', route: '/material/buttons' },
        { id: 'mat-data', label: 'Visualización', icon: 'ti ti-credit-card', route: '/material/data' },
        { id: 'mat-feedback', label: 'Feedback', icon: 'ti ti-bell-ringing', route: '/material/feedback' },
        { id: 'mat-inputs', label: 'Inputs', icon: 'ti ti-toggle-left', route: '/material/inputs' },
        { id: 'mat-navigation', label: 'Navegación', icon: 'ti ti-navigation', route: '/material/navigation' },
        { id: 'mat-charts', label: 'Gráficas', icon: 'ti ti-chart-bar', route: '/material/charts' },
      ]
    }
  ];

  /** Secciones expandidas/colapsadas — por defecto todas expandidas */
  expandedSections = signal<Set<string>>(
    new Set(this.menuSections.map(s => s.title))
  );

  setActive(itemId: string): void {
    this.activeItem.set(itemId);
  }

  toggleExpand(itemId: string): void {
    this.expandedItems.update(set => {
      const next = new Set(set);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }

  isExpanded(itemId: string): boolean {
    return this.expandedItems().has(itemId);
  }

  /** Toggle sección expandida/colapsada */
  toggleSection(title: string): void {
    this.expandedSections.update(set => {
      const next = new Set(set);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  }

  isSectionExpanded(title: string): boolean {
    return this.expandedSections().has(title);
  }

  logout(): void {
    localStorage.removeItem('josidk-token');
    this.router.navigate(['/login']);
  }
}
