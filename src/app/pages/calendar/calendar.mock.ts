// MOCK — reemplazar por un servicio HTTP.

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  color: string;
  description: string;
}

export const MOCK_EVENTS: Record<number, CalendarEvent[]> = {
  3: [{ id: 'e1', title: 'Reunión de equipo', time: '10:00', color: '#3b82f6', description: 'Sprint planning semanal' }],
  5: [{ id: 'e2', title: 'Entrega sprint', time: '14:00', color: '#22c55e', description: 'Demo de funcionalidades al cliente' }],
  7: [
    { id: 'e3', title: 'Standup diario', time: '09:00', color: '#8b5cf6', description: 'Daily con el equipo de desarrollo' },
    { id: 'e4', title: 'Code review', time: '15:00', color: '#f59e0b', description: 'Revisar PR del módulo de facturación' },
  ],
  10: [{ id: 'e5', title: 'Demo cliente', time: '11:00', color: '#ef4444', description: 'Presentación del nuevo dashboard' }],
  12: [{ id: 'e6', title: 'Planning Q3', time: '10:00', color: '#3b82f6', description: 'Planificación del próximo trimestre' }],
  15: [{ id: 'e7', title: 'Retrospectiva', time: '16:00', color: '#8b5cf6', description: 'Retro del último sprint' }],
  18: [{ id: 'e8', title: 'Taller de diseño', time: '09:30', color: '#f59e0b', description: 'Workshop de UX para el nuevo módulo' }],
  20: [{ id: 'e9', title: 'Release v2.0', time: '14:00', color: '#22c55e', description: 'Despliegue a producción' }],
  25: [{ id: 'e10', title: 'All Hands', time: '10:00', color: '#3b82f6', description: 'Reunión general de la empresa' }],
};
