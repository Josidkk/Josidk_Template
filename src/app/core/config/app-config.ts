/**
 * ═══════════════════════════════════════════════
 *  App Configuration
 *  ────────────────
 *  Centralized settings for branding & demo user.
 *  Cambia estos valores para personalizar todo
 *  el template sin tocar componentes.
 * ═══════════════════════════════════════════════
 */
export const APP_CONFIG = {
  /** Nombre del sitio / empresa (sidebar, footer, title, logo) */
  siteName: 'Josidk',
  /** Nombre largo con branding (app.component.ts) */
  siteFullName: 'Josidk ERP',

  /** Usuario demo que aparece en sidebar, navbar, perfil, etc. */
  user: {
    name: 'Deyby Josue',
    email: 'deyby@josidk.com',
    role: 'Developer',
    initials: 'DJ',
    phone: '+1 (809) 555-1234',
    location: 'Santo Domingo, RD',
    department: 'Tecnología',
    joinDate: '15 Mar 2023',
    bio: 'Desarrollador Full Stack apasionado por crear soluciones ERP modernas y eficientes. Especializado en Angular, TypeScript y arquitectura de software.',
  },

  /** Skills demo del perfil */
  skills: [
    { name: 'Angular / TypeScript', level: 92, color: '#dd0031' },
    { name: 'React / Next.js', level: 78, color: '#61dafb' },
    { name: 'Node.js / NestJS', level: 85, color: '#339933' },
    { name: 'PostgreSQL / MongoDB', level: 80, color: '#336791' },
    { name: 'UI/UX Design', level: 70, color: '#f59e0b' },
    { name: 'DevOps / Docker', level: 65, color: '#2496ed' },
  ],
} as const;
