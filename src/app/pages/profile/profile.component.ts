import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';
import { APP_CONFIG } from '../../core/config/app-config';
import { Activity, MOCK_ACTIVITIES } from './profile.mock';

interface Skill {
  name: string;
  level: number; // 0–100
  color: string;
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

  activities: Activity[] = MOCK_ACTIVITIES;

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
