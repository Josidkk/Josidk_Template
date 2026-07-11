# PROJECT_STATE — josidk-template

Current-state snapshot. Keep this short — it's the page someone reads when
they want "where is this project today?" without digging through commits.
Updated when state shifts, not on every commit.

## Status

**Phase:** v1.0.0 funcional — plantilla usable como base visual; saldo de defectos del configurador y pulido de accesibilidad en curso
**Last update:** 2026-07-11
**Owner:** Grupo Platino (develop@grupoplatino.hn)

## What's live

- App Angular 18 en http://localhost:4200 (`npm install && npm start`). Login dummy: cualquier email/contraseña.
- 14 páginas con lazy loading: Dashboard, eCommerce (CRUD mock), Usuarios, Perfil, Kanban (drag & drop), Calendario, Email, Chat, UI Components, 6 páginas Material UI, Login, Register.
- Layout completo: sidebar colapsable + navbar (dark mode, notificaciones, perfil) + footer, todo alimentado por `app-config.ts`.
- Sistema de diseño por variables CSS con tema claro/oscuro reactivo (signals, persistido en `localStorage`).
- Configurador visual (`/settings`): 6 paletas + editor de color, toggle de módulos, presets de layout, tipografía y **descarga de un ZIP personalizado** generado en el navegador (JSZip).
- Servicios centrales: `ThemeService`, `NotificationService` (snackbars glassmorphism), `SidebarConfigService`, `AuthGuard`.

## What's in flight

- Metadata para agentes recién añadida (AGENTS/CLAUDE/OBJECTIVES/DECISIONS/PROJECT_STATE/TASK_QUEUE/TOOLING) — generada leyendo el código real el 2026-07-04. README y DOCUMENTACION.md permanecen intactos (propiedad del autor).
- Tres defectos del configurador destapados y documentados (ver DECISIONS D-006, D-007, D-008) — pendientes de corrección.
- Pulido de diseño/accesibilidad iniciado (2026-07-11): critique del login (24/40, snapshot en `.impeccable/critique/`), contraste WCAG AA del tema claro corregido (D-011, T-010), auth full-bleed sin marco de tarjeta (D-012, T-011). Contexto de diseño en `PRODUCT.md`. Pendiente: T-009 (loading/ARIA/reduced-motion del auth).

## Blockers

- none (los defectos abiertos no bloquean el uso; degradan la fidelidad del ZIP/preview).

## Next

- Saldar defectos del configurador: arreglar el regex de `applyDefaultTheme` (T-001), conectar o retirar `animationStyle` (T-002), corregir el redirect de `cleanRoutes` (T-003).
- Mejorar UX: persistir layout/tipografía/módulos/tema en `localStorage` (T-004).
- Camino a producción (para quien adopte la plantilla): auth real + interceptor HTTP + reemplazar datos mock (T-005).

Ver `TASK_QUEUE.md` para la lista completa.
