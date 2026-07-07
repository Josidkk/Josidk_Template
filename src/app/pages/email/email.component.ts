import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';
import { ComposeEmailDialogComponent, ComposeEmailData } from '../../shared/compose-email-dialog/compose-email-dialog.component';
import { NotificationService } from '../../core/services/notification.service';
import { Email, EmailFolder, MOCK_EMAILS, MOCK_FOLDERS } from './email.mock';

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

  folders: EmailFolder[] = MOCK_FOLDERS;

  emails = signal<Email[]>(MOCK_EMAILS);

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
