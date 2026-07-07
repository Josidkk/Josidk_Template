import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, CdkDragMove, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';
import { KanbanTask, KanbanColumn, MOCK_COLUMNS } from './kanban.mock';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, BreadcrumbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})
export class KanbanComponent {

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Apps', route: '/kanban' },
    { label: 'Kanban' },
  ];

  searchQuery = signal('');
  showModal = signal(false);
  showDeleteConfirm = signal(false);
  editingTask = signal<KanbanTask | null>(null);
  deleteTarget = signal<{ column: KanbanColumn; task: KanbanTask } | null>(null);
  activeColumnForNew = signal<KanbanColumn | null>(null);

  // Form fields
  formTitle = '';
  formDescription = '';
  formPriority: 'alta' | 'media' | 'baja' = 'media';
  formAssignee = '';
  formDueDate = '';
  formTags = '';

  // structuredClone: cada instancia arranca con datos frescos (drag & drop muta el tablero in-place).
  columns = signal<KanbanColumn[]>(structuredClone(MOCK_COLUMNS));

  totalTasks = computed(() => this.columns().reduce((sum, col) => sum + col.tasks.length, 0));

  filteredColumns = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cols = this.columns();
    if (!q) return cols;
    return cols.map(col => ({
      ...col,
      tasks: col.tasks.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q) ||
        (t.tags || []).some(tag => tag.toLowerCase().includes(q))
      )
    }));
  });

  /* ── Auto-scroll while dragging ── */
  private autoScrollRAF: number | null = null;
  private lastClientY = 0;

  onDragMoved(event: CdkDragMove): void {
    // clientY funciona tanto en mouse como en touch
    const ev = event.event as MouseEvent | TouchEvent;
    this.lastClientY = 'touches' in ev ? ev.touches[0].clientY : ev.clientY;

    if (this.autoScrollRAF === null) {
      this.autoScrollRAF = requestAnimationFrame(() => this.autoScrollTick());
    }
  }

  private autoScrollTick(): void {
    const threshold = 60;
    const speed = 8;
    const clientY = this.lastClientY;
    const container = document.querySelector('.content');

    if (!container) { this.autoScrollRAF = null; return; }

    if (clientY < threshold) {
      container.scrollBy(0, -speed);
      this.autoScrollRAF = requestAnimationFrame(() => this.autoScrollTick());
    } else if (clientY > window.innerHeight - threshold) {
      container.scrollBy(0, speed);
      this.autoScrollRAF = requestAnimationFrame(() => this.autoScrollTick());
    } else {
      this.autoScrollRAF = null;
    }
  }

  // ── Drag & Drop ────────────────────────────────────────────────

  drop(event: CdkDragDrop<KanbanTask[]>): void {
    if (this.autoScrollRAF !== null) {
      cancelAnimationFrame(this.autoScrollRAF);
      this.autoScrollRAF = null;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // Force signal update — CDK mutates arrays in-place, signal needs new reference
    this.columns.update(cols => cols.map(c => ({ ...c, tasks: [...c.tasks] })));
  }

  // ── Create / Edit Modal ────────────────────────────────────────

  openNewTask(column: KanbanColumn): void {
    this.activeColumnForNew.set(column);
    this.editingTask.set(null);
    this.resetForm();
    this.showModal.set(true);
  }

  openEditTask(column: KanbanColumn, task: KanbanTask): void {
    this.activeColumnForNew.set(column);
    this.editingTask.set(task);
    this.formTitle = task.title;
    this.formDescription = task.description;
    this.formPriority = task.priority;
    this.formAssignee = task.assignee;
    this.formDueDate = task.dueDate;
    this.formTags = (task.tags || []).join(', ');
    this.showModal.set(true);
  }

  saveTask(): void {
    if (!this.formTitle.trim()) return;

    const col = this.activeColumnForNew();
    if (!col) return;

    const tags = this.formTags.split(',').map(t => t.trim()).filter(Boolean);
    const initials = this.formAssignee.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

    this.columns.update(cols => cols.map(c => {
      if (c.id !== col.id) return c;

      if (this.editingTask()) {
        // Edit existing
        return {
          ...c,
          tasks: c.tasks.map(t =>
            t.id === this.editingTask()!.id
              ? {
                  ...t,
                  title: this.formTitle.trim(),
                  description: this.formDescription.trim(),
                  priority: this.formPriority,
                  assignee: this.formAssignee.trim() || 'Sin asignar',
                  initials,
                  dueDate: this.formDueDate || 'Sin fecha',
                  tags,
                }
              : t
          ),
        };
      }

      // Create new
      const newTask: KanbanTask = {
        id: String(Date.now()),
        title: this.formTitle.trim(),
        description: this.formDescription.trim(),
        priority: this.formPriority,
        assignee: this.formAssignee.trim() || 'Sin asignar',
        initials,
        dueDate: this.formDueDate || 'Sin fecha',
        tags,
      };
      return { ...c, tasks: [newTask, ...c.tasks] };
    }));

    this.closeModal();
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingTask.set(null);
    this.activeColumnForNew.set(null);
    this.resetForm();
  }

  // ── Delete ─────────────────────────────────────────────────────

  confirmDelete(column: KanbanColumn, task: KanbanTask): void {
    this.deleteTarget.set({ column, task });
    this.showDeleteConfirm.set(true);
  }

  deleteTask(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.columns.update(cols => cols.map(c =>
      c.id === target.column.id
        ? { ...c, tasks: c.tasks.filter(t => t.id !== target.task.id) }
        : c
    ));
    this.showDeleteConfirm.set(false);
    this.deleteTarget.set(null);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deleteTarget.set(null);
  }

  // ── Helpers ────────────────────────────────────────────────────

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  private resetForm(): void {
    this.formTitle = '';
    this.formDescription = '';
    this.formPriority = 'media';
    this.formAssignee = '';
    this.formDueDate = '';
    this.formTags = '';
  }
}
