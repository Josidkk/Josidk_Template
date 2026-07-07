// MOCK — reemplazar por un servicio HTTP.
// Datos ficticios de la tabla de usuarios (demo). Sustituye MOCK_USERS por
// la respuesta real de tu API cuando conectes un backend.

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Pending' | 'Inactive';
  avatar?: string;
  lastLogin: string;
}

export const MOCK_USERS: User[] = [
  { id: 'USR-001', name: 'Deyby Josue', email: 'deyby@josidk.com', role: 'Admin', status: 'Active', lastLogin: 'Hace 2 horas', avatar: 'ti ti-user-circle' },
  { id: 'USR-002', name: 'Ana Rodriguez', email: 'ana.r@josidk.com', role: 'Editor', status: 'Active', lastLogin: 'Hace 5 horas' },
  { id: 'USR-003', name: 'Carlos Mendez', email: 'carlos.m@josidk.com', role: 'Viewer', status: 'Pending', lastLogin: 'Nunca' },
  { id: 'USR-004', name: 'Laura Sanchez', email: 'laura.s@josidk.com', role: 'Editor', status: 'Inactive', lastLogin: 'Hace 2 días' },
  { id: 'USR-005', name: 'Roberto Gomez', email: 'roberto.g@josidk.com', role: 'Viewer', status: 'Active', lastLogin: 'Hace 1 hora' },
  { id: 'USR-006', name: 'Maria Lopez', email: 'maria.l@josidk.com', role: 'Viewer', status: 'Active', lastLogin: 'Ayer' },
  { id: 'USR-007', name: 'Jorge Perez', email: 'jorge.p@josidk.com', role: 'Admin', status: 'Inactive', lastLogin: 'Hace 1 semana' }
];
