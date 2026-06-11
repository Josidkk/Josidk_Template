import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';
import { APP_CONFIG } from '../../core/config/app-config';

interface Skill {
  name: string;
  level: number; // 0–100
  color: string;
}

interface Activity {
  action: string;
  detail: string;
  time: string;
  icon: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Mi Perfil' },
  ];

  user = signal({ ...APP_CONFIG.user });

  /** Iniciales del usuario (primeras 2 letras del nombre) */
  userInitials = computed(() => {
    const parts = this.user().name.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
  });

  skills: Skill[] = [...APP_CONFIG.skills];

  activities: Activity[] = [
    { action: 'Completó tarea', detail: 'Diseñar landing page', time: 'Hace 2h', icon: 'ti ti-check' },
    { action: 'Subió PR', detail: 'feat: add notification system', time: 'Hace 5h', icon: 'ti ti-git-pull-request' },
    { action: 'Comentó', detail: 'Revisión del módulo de pagos', time: 'Ayer', icon: 'ti ti-message-2' },
    { action: 'Creó proyecto', detail: 'Dashboard Analytics v2', time: 'Ayer', icon: 'ti ti-folder-plus' },
    { action: 'Actualizó perfil', detail: 'Cambió su foto de perfil', time: '3 Jun', icon: 'ti ti-user-edit' },
  ];

  editMode = signal(false);
  editedUser = { ...this.user() };

  toggleEdit(): void {
    this.editMode.set(!this.editMode());
    if (this.editMode()) {
      this.editedUser = { ...this.user() };
    }
  }

  saveProfile(): void {
    this.user.set({ ...this.editedUser });
    this.editMode.set(false);
  }

  cancelEdit(): void {
    this.editMode.set(false);
  }
}
