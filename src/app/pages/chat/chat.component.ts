import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';
import { Contact, ChatMessage, MOCK_CONTACTS, MOCK_MESSAGES } from './chat.mock';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Apps', route: '/chat' },
    { label: 'Chat' },
  ];

  activeContact = signal<Contact | null>(null);
  newMessage = '';

  contacts: Contact[] = MOCK_CONTACTS;

  // structuredClone: cada instancia arranca con datos frescos (sendMessage muta el historial in-place).
  messages: Record<string, ChatMessage[]> = structuredClone(MOCK_MESSAGES);

  selectContact(contact: Contact): void {
    this.activeContact.set(contact);
    contact.unread = 0;
  }

  get currentMessages(): ChatMessage[] {
    const c = this.activeContact();
    return c ? (this.messages[c.id] || []) : [];
  }

  sendMessage(): void {
    const text = this.newMessage.trim();
    const c = this.activeContact();
    if (!text || !c) return;

    if (!this.messages[c.id]) {
      this.messages[c.id] = [];
    }

    this.messages[c.id].push({
      id: String(Date.now()),
      sender: 'Tú',
      text,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    });

    c.lastMessage = text;
    c.time = 'Ahora';
    this.newMessage = '';
  }

  goBack(): void {
    this.activeContact.set(null);
  }
}
