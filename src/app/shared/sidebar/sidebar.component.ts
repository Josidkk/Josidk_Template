import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isCollapsed = false;

  activeItem = 'analytical';
  expandedItems: Set<string> = new Set();

  menuSections: MenuSection[] = [
    {
      title: 'HOME',
      items: [
        { id: 'analytical', label: 'Analytical', icon: 'ti ti-chart-dots' },
        {
          id: 'frontend',
          label: 'Frontend pages',
          icon: 'ti ti-app-window',
          children: [
            { id: 'landing', label: 'Landing Page', icon: 'ti ti-point' },
            { id: 'about', label: 'About', icon: 'ti ti-point' }
          ]
        }
      ]
    },
    {
      title: 'APPS',
      items: [

        { id: 'usuarios', label: 'Users', icon: 'ti ti-users', route: '/users' },
        { id: 'login', label: 'Login', icon: 'ti ti-certificate', route:'/login' },

      ]
    }
  ];

  setActive(itemId: string): void {
    this.activeItem = itemId;
  }

  toggleExpand(itemId: string): void {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId);
    } else {
      this.expandedItems.add(itemId);
    }
  }

  isExpanded(itemId: string): boolean {
    return this.expandedItems.has(itemId);
  }
}
