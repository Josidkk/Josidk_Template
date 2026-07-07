// MOCK — reemplazar por un servicio HTTP.

export interface Contact {
  id: string;
  name: string;
  initials: string;
  color: string;
  lastMessage: string;
  time: string;
  online: boolean;
  unread: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMine: boolean;
}

export const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'María García', initials: 'MG', color: '#3b82f6', lastMessage: '¿Ya revisaste el PR?', time: '10:30', online: true, unread: 2 },
  { id: '2', name: 'Carlos López', initials: 'CL', color: '#22c55e', lastMessage: 'El deploy está listo', time: '09:15', online: true, unread: 0 },
  { id: '3', name: 'Ana Martínez', initials: 'AM', color: '#f59e0b', lastMessage: 'Perfecto, nos vemos mañana', time: 'Ayer', online: false, unread: 0 },
  { id: '4', name: 'Pedro Sánchez', initials: 'PS', color: '#ef4444', lastMessage: 'Gracias por la ayuda', time: 'Ayer', online: false, unread: 1 },
  { id: '5', name: 'Luis Ramírez', initials: 'LR', color: '#8b5cf6', lastMessage: 'Los wireframes están en Figma', time: '1 Jun', online: true, unread: 0 },
];

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  '1': [
    { id: '1', sender: 'María García', text: 'Hola, ¿cómo vas con el módulo de pagos?', time: '10:00', isMine: false },
    { id: '2', sender: 'Tú', text: 'Ya está casi listo, solo falta la integración con Stripe', time: '10:15', isMine: true },
    { id: '3', sender: 'María García', text: 'Genial, ¿puedes mandar el PR hoy?', time: '10:20', isMine: false },
    { id: '4', sender: 'Tú', text: 'Sí, lo subo en la tarde', time: '10:25', isMine: true },
    { id: '5', sender: 'María García', text: '¿Ya revisaste el PR?', time: '10:30', isMine: false },
  ],
  '2': [
    { id: '1', sender: 'Carlos López', text: 'El deploy de staging está listo', time: '09:00', isMine: false },
    { id: '2', sender: 'Tú', text: 'Perfecto, lo pruebo ahora', time: '09:10', isMine: true },
    { id: '3', sender: 'Carlos López', text: 'El deploy está listo', time: '09:15', isMine: false },
  ],
};
