import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';
import { ComposeEmailDialogComponent, ComposeEmailData } from '../../shared/compose-email-dialog/compose-email-dialog.component';
import { NotificationService } from '../../core/services/notification.service';

interface Email {
  id: string;
  from: string;
  initials: string;
  color: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
  starred: boolean;
}

interface EmailFolder {
  id: string;
  label: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss'
})
export class EmailComponent {
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Apps', route: '/email' },
    { label: 'Email' },
  ];

  activeFolder = signal('inbox');
  selectedEmail = signal<Email | null>(null);

  // Mobile: si está en vista de carpetas o lista de correos
  mobileShowFolders = signal(true);

  folders: EmailFolder[] = [
    { id: 'inbox', label: 'Entrada', icon: 'ti ti-inbox', count: 12 },
    { id: 'starred', label: 'Destacados', icon: 'ti ti-star', count: 3 },
    { id: 'sent', label: 'Enviados', icon: 'ti ti-send', count: 0 },
    { id: 'drafts', label: 'Borradores', icon: 'ti ti-file', count: 2 },
    { id: 'trash', label: 'Papelera', icon: 'ti ti-trash', count: 0 },
  ];

  emails = signal<Email[]>([
    { id: '1', from: 'María García', initials: 'MG', color: '#3b82f6', subject: 'Re: Presupuesto Q3', preview: 'Hola, revisé el presupuesto y parece correcto. Podemos proceder con la...', time: '10:30', read: false, starred: true },
    { id: '2', from: 'Carlos López', initials: 'CL', color: '#22c55e', subject: 'Actualización del sprint', preview: 'Equipo, les comparto el avance del sprint actual. Llevamos el 75% de...', time: '09:15', read: false, starred: false },
    { id: '3', from: 'Ana Martínez', initials: 'AM', color: '#f59e0b', subject: 'Reunión de planificación', preview: '¿Podemos agendar una reunión para el viernes? Necesito discutir los...', time: 'Ayer', read: true, starred: false },
    { id: '4', from: 'Pedro Sánchez', initials: 'PS', color: '#ef4444', subject: 'Bug en producción', preview: 'Encontré un error crítico en el módulo de pagos. Los usuarios no pueden...', time: 'Ayer', read: true, starred: false },
    { id: '5', from: 'GitHub', initials: 'GH', color: '#8b5cf6', subject: '[Josidk/ERP] PR #142 merged', preview: 'Pull request #142 "feat: add notification system" has been merged into...', time: '2 Jun', read: true, starred: false },
    { id: '6', from: 'Luis Ramírez', initials: 'LR', color: '#14b8a6', subject: 'Diseño nuevo dashboard', preview: 'Te envío los wireframes del nuevo dashboard. Incluye las métricas que...', time: '1 Jun', read: true, starred: true },
  ]);

  get activeFolderLabel(): string {
    const folder = this.folders.find(f => f.id === this.activeFolder());
    return folder ? folder.label : 'Entrada';
  }

  selectFolder(id: string): void {
    this.activeFolder.set(id);
    this.mobileShowFolders.set(false); // mobile: cambiar a lista
    this.selectedEmail.set(null);
  }

  showFolders(): void {
    this.mobileShowFolders.set(true); // mobile: volver a carpetas
    this.selectedEmail.set(null);
  }

  selectEmail(email: Email): void {
    this.selectedEmail.set(email);
  }

  goBack(): void {
    this.selectedEmail.set(null);
  }

  openCompose(): void {
    const dialogRef = this.dialog.open(ComposeEmailDialogComponent, {
      panelClass: 'glass-dialog-overlay',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: ComposeEmailData | null) => {
      if (!result) return;
      this.sendEmail(result);
    });
  }

  private sendEmail(data: ComposeEmailData): void {
    const initials = data.to.split('@')[0].substring(0, 2).toUpperCase();
    const newEmail: Email = {
      id: String(Date.now()),
      from: data.to,
      initials,
      color: '#3b82f6',
      subject: data.subject,
      preview: data.message.substring(0, 80),
      time: 'Ahora',
      read: false,
      starred: false,
    };

    // Add to inbox
    this.emails.update(list => [newEmail, ...list]);

    // Update inbox count
    const inbox = this.folders.find(f => f.id === 'inbox');
    if (inbox) inbox.count++;

    this.notify.success('Correo enviado', `Para: ${data.to}`);
  }

  toggleStar(email: Email, event: Event): void {
    event.stopPropagation();
    this.emails.update(list => list.map(e =>
      e.id === email.id ? { ...e, starred: !e.starred } : e
    ));
  }
}
