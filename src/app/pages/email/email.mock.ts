// MOCK — reemplazar por un servicio HTTP.

export interface Email {
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

export interface EmailFolder {
  id: string;
  label: string;
  icon: string;
  count: number;
}

export const MOCK_EMAILS: Email[] = [
  { id: '1', from: 'María García', initials: 'MG', color: '#3b82f6', subject: 'Re: Presupuesto Q3', preview: 'Hola, revisé el presupuesto y parece correcto. Podemos proceder con la...', time: '10:30', read: false, starred: true },
  { id: '2', from: 'Carlos López', initials: 'CL', color: '#22c55e', subject: 'Actualización del sprint', preview: 'Equipo, les comparto el avance del sprint actual. Llevamos el 75% de...', time: '09:15', read: false, starred: false },
  { id: '3', from: 'Ana Martínez', initials: 'AM', color: '#f59e0b', subject: 'Reunión de planificación', preview: '¿Podemos agendar una reunión para el viernes? Necesito discutir los...', time: 'Ayer', read: true, starred: false },
  { id: '4', from: 'Pedro Sánchez', initials: 'PS', color: '#ef4444', subject: 'Bug en producción', preview: 'Encontré un error crítico en el módulo de pagos. Los usuarios no pueden...', time: 'Ayer', read: true, starred: false },
  { id: '5', from: 'GitHub', initials: 'GH', color: '#8b5cf6', subject: '[Josidk/ERP] PR #142 merged', preview: 'Pull request #142 "feat: add notification system" has been merged into...', time: '2 Jun', read: true, starred: false },
  { id: '6', from: 'Luis Ramírez', initials: 'LR', color: '#14b8a6', subject: 'Diseño nuevo dashboard', preview: 'Te envío los wireframes del nuevo dashboard. Incluye las métricas que...', time: '1 Jun', read: true, starred: true },
];

export const MOCK_FOLDERS: EmailFolder[] = [
  { id: 'inbox', label: 'Entrada', icon: 'ti ti-inbox', count: 12 },
  { id: 'starred', label: 'Destacados', icon: 'ti ti-star', count: 3 },
  { id: 'sent', label: 'Enviados', icon: 'ti ti-send', count: 0 },
  { id: 'drafts', label: 'Borradores', icon: 'ti ti-file', count: 2 },
  { id: 'trash', label: 'Papelera', icon: 'ti ti-trash', count: 0 },
];
