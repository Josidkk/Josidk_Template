// MOCK — reemplazar por un servicio HTTP.

export interface Activity {
  action: string;
  detail: string;
  time: string;
  icon: string;
}

export const MOCK_ACTIVITIES: Activity[] = [
  { action: 'Completó tarea', detail: 'Diseñar landing page', time: 'Hace 2h', icon: 'ti ti-check' },
  { action: 'Subió PR', detail: 'feat: add notification system', time: 'Hace 5h', icon: 'ti ti-git-pull-request' },
  { action: 'Comentó', detail: 'Revisión del módulo de pagos', time: 'Ayer', icon: 'ti ti-message-2' },
  { action: 'Creó proyecto', detail: 'Dashboard Analytics v2', time: 'Ayer', icon: 'ti ti-folder-plus' },
  { action: 'Actualizó perfil', detail: 'Cambió su foto de perfil', time: '3 Jun', icon: 'ti ti-user-edit' },
];
