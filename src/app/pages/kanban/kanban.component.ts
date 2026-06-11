import { Component, ChangeDetectionStrategy, signal, computed, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, CdkDragMove, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  priority: 'alta' | 'media' | 'baja';
  assignee: string;
  initials: string;
  dueDate: string;
  tags?: string[];
}

export interface KanbanColumn {
  id: string;
  title: string;
  icon: string;
  color: string;
  tasks: KanbanTask[];
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, BreadcrumbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})
export class KanbanComponent {
  private cdr = inject(ChangeDetectorRef);

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

  columns: KanbanColumn[] = [
    {
      id: 'todo',
      title: 'Por Hacer',
      icon: 'ti ti-circle-dotted',
      color: '#94a3b8',
      tasks: [
        { id: '1', title: 'Diseñar landing page', description: 'Crear mockup en Figma para la nueva landing', priority: 'alta', assignee: 'Ana', initials: 'A', dueDate: '10 Jun', tags: ['diseño'] },
        { id: '2', title: 'Configurar CI/CD', description: 'Pipeline de GitHub Actions para staging', priority: 'media', assignee: 'Carlos', initials: 'C', dueDate: '12 Jun', tags: ['devops'] },
        { id: '3', title: 'Escribir tests unitarios', description: 'Módulo de autenticación', priority: 'baja', assignee: 'Luis', initials: 'L', dueDate: '15 Jun', tags: ['testing'] },
      ]
    },
    {
      id: 'progress',
      title: 'En Progreso',
      icon: 'ti ti-loader',
      color: '#3b82f6',
      tasks: [
        { id: '4', title: 'API de pagos', description: 'Integrar Stripe en el backend', priority: 'alta', assignee: 'María', initials: 'M', dueDate: '8 Jun', tags: ['backend'] },
        { id: '5', title: 'Dashboard analytics', description: 'Gráficas de ventas mensuales', priority: 'media', assignee: 'Deyby', initials: 'DJ', dueDate: '11 Jun', tags: ['frontend'] },
      ]
    },
    {
      id: 'review',
      title: 'En Revisión',
      icon: 'ti ti-eye',
      color: '#f59e0b',
      tasks: [
        { id: '6', title: 'Módulo de inventario', description: 'CRUD completo de productos', priority: 'alta', assignee: 'Pedro', initials: 'P', dueDate: '7 Jun', tags: ['backend', 'frontend'] },
      ]
    },
    {
      id: 'done',
      title: 'Hecho',
      icon: 'ti ti-circle-check',
      color: '#22c55e',
      tasks: [
        { id: '7', title: 'Login con OAuth', description: 'Google y GitHub auth', priority: 'media', assignee: 'Ana', initials: 'A', dueDate: '1 Jun', tags: ['auth'] },
        { id: '8', title: 'Sistema de notificaciones', description: 'Push notifications en tiempo real', priority: 'baja', assignee: 'Carlos', initials: 'C', dueDate: '3 Jun', tags: ['backend'] },
        { id: '9', title: 'Responsive navbar', description: 'Menú adaptable para móvil', priority: 'baja', assignee: 'Luis', initials: 'L', dueDate: '2 Jun', tags: ['frontend'] },
      ]
    }
  ];

  totalTasks = computed(() => this.columns.reduce((sum, col) => sum + col.tasks.length, 0));

  filteredColumns = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.columns;
    return this.columns.map(col => ({
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
    this.cdr.markForCheck();
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

    if (this.editingTask()) {
      // Edit existing
      const task = this.editingTask()!;
      task.title = this.formTitle.trim();
      task.description = this.formDescription.trim();
      task.priority = this.formPriority;
      task.assignee = this.formAssignee.trim() || 'Sin asignar';
      task.initials = initials;
      task.dueDate = this.formDueDate || 'Sin fecha';
      task.tags = tags;
    } else {
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
      col.tasks.unshift(newTask);
    }

    this.closeModal();
    this.cdr.markForCheck();
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
    target.column.tasks = target.column.tasks.filter(t => t.id !== target.task.id);
    this.showDeleteConfirm.set(false);
    this.deleteTarget.set(null);
    this.cdr.markForCheck();
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
