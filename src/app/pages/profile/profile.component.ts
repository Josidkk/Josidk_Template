import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';

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

  user = signal({
    name: 'Deyby Josue',
    email: 'deyby@josidk.com',
    role: 'Developer',
    phone: '+1 (809) 555-1234',
    department: 'Tecnología',
    location: 'Santo Domingo, RD',
    joinDate: '15 Mar 2023',
    bio: 'Desarrollador Full Stack apasionado por crear soluciones ERP modernas y eficientes. Especializado en Angular, TypeScript y arquitectura de software.',
  });

  skills: Skill[] = [
    { name: 'Angular / TypeScript', level: 92, color: '#dd0031' },
    { name: 'React / Next.js', level: 78, color: '#61dafb' },
    { name: 'Node.js / NestJS', level: 85, color: '#339933' },
    { name: 'PostgreSQL / MongoDB', level: 80, color: '#336791' },
    { name: 'UI/UX Design', level: 70, color: '#f59e0b' },
    { name: 'DevOps / Docker', level: 65, color: '#2496ed' },
  ];

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
