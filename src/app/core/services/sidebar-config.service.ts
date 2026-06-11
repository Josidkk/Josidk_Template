import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'josidk-sidebar-config';

@Injectable({ providedIn: 'root' })
export class SidebarConfigService {
  private hiddenSections = signal<Set<string>>(new Set(this.load()));

  /** Returns the reactive set of hidden section titles. */
  readonly hidden = this.hiddenSections.asReadonly();

  private load(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.hiddenSections()]));
  }

  isSectionVisible(sectionTitle: string): boolean {
    return !this.hiddenSections().has(sectionTitle);
  }

  toggleSection(sectionTitle: string, visible: boolean): void {
    this.hiddenSections.update(set => {
      const next = new Set(set);
      if (visible) next.delete(sectionTitle);
      else next.add(sectionTitle);
      return next;
    });
    this.save();
  }
}
