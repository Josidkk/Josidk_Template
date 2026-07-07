// MOCK — reemplazar por un servicio HTTP.

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

export const MOCK_COLUMNS: KanbanColumn[] = [
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
