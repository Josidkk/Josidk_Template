import { Component, EventEmitter, Output, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  private theme = inject(ThemeService);

  readonly isDark = this.theme.isDark;

  searchQuery = '';

  user = {
    name: 'Deyby Josue',
    initials: 'DJ',
    avatarUrl: null as string | null,
  };

  onToggle(): void {
    this.toggleSidebar.emit();
  }

  toggleTheme(): void {
    this.theme.toggle();
  }
}
