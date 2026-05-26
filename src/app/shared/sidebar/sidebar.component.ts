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
        { id: 'ecommerce', label: 'eCommerce', icon: 'ti ti-shopping-cart' },
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
        { id: 'chat', label: 'Chat', icon: 'ti ti-message-dots' },
        { id: 'calendar', label: 'Calendar', icon: 'ti ti-calendar' },
        { id: 'email', label: 'Email', icon: 'ti ti-mail' },
        { id: 'kanban', label: 'Kanban', icon: 'ti ti-layout-kanban' },
        { id: 'user-profile', label: 'User Profile', icon: 'ti ti-user-circle', badge: 'New' },
        { id: 'ecommerce-app', label: 'Ecommerce', icon: 'ti ti-basket', badge: 'New' },
        { id: 'users', label: 'Users', icon: 'ti ti-users', route: '/users' },
        { id: 'courses', label: 'Courses', icon: 'ti ti-certificate' },
        { id: 'employee', label: 'Employee', icon: 'ti ti-brand-ctemplar' },
        { id: 'notes', label: 'Notes', icon: 'ti ti-note' }
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
