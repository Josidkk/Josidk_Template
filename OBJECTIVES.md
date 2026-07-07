---
owner: Grupo Platino (develop@grupoplatino.hn)
status: active
last_updated: 2026-07-04
---

# OBJECTIVES — josidk-template

## Goal

Ofrecer una **plantilla base de dashboard/ERP administrativo en Angular 18** (Angular Material + Chart.js + Tabler Icons) que un desarrollador pueda personalizar sin tocar código desde un configurador visual (`/settings`) — colores, páginas activas, layout, tipografía y tema oscuro — y **descargar como un proyecto ZIP listo para arrancar** con la configuración ya aplicada. Las páginas de negocio (Dashboard, eCommerce, Kanban, Chat, Email, Calendario, etc.) se entregan como **demos con datos ficticios** que sirven de punto de partida visual.

## Success criteria

- [x] Arranque en un comando (`npm install && npm start` → http://localhost:4200) con login dummy (cualquier email/contraseña). *(SC-001)*
- [x] Marca y usuario centralizados en un único archivo (`src/app/core/config/app-config.ts`) que se refleja en sidebar, navbar, perfil, footer y título. *(SC-002)*
- [x] Tematización en vivo: 6 paletas predefinidas + editor personalizado, con vista previa inmediata vía variables CSS. *(SC-003)*
- [x] Tema claro/oscuro reactivo (Angular signals) persistido en `localStorage`. *(SC-004)*
- [x] Descarga de un ZIP con las páginas seleccionadas, colores y layout aplicados, generado **en el navegador** (JSZip) sin backend. *(SC-005)*
- [ ] La configuración del ZIP descargado refleja **fielmente** todo lo elegido en `/settings` — hoy el «modo oscuro por defecto» se ignora y `animationStyle` no tiene efecto. *(defectos abiertos — T-001, T-002; ver DECISIONS D-006, D-007)*
- [ ] La configuración de layout/tipografía/módulos sobrevive a un reload del configurador (hoy solo persiste la paleta). *(deuda — T-004; ver DECISIONS D-009)*
- [ ] Autenticación real (JWT/API) que reemplace el token dummy antes de cualquier uso en producción. *(pendiente de producción — T-005)*

## Current status

Plantilla **funcional y usable como base visual** (v1.0.0): 14 páginas con lazy loading, layout completo (sidebar colapsable + navbar + footer), sistema de diseño por variables CSS, y un configurador visual que genera un ZIP personalizado en el navegador. La generación del ZIP funciona, pero **dos ajustes del configurador no llegan al proyecto descargado** (tema por defecto y estilo de animación) — ver `DECISIONS.md` y `TASK_QUEUE.md`. Las páginas de negocio usan **datos mock**; migrar a datos reales es responsabilidad de quien adopte la plantilla.

## Stakeholders

- **Owner:** Grupo Platino (develop@grupoplatino.hn) (see frontmatter)
- **Autor original:** Josidk / Deyby Josue (branding demo en `app-config.ts`).
- **Consumers:** desarrolladores que necesitan un punto de partida de dashboard/ERP en Angular listo para rebrandear.
- **Reviewers:** —

## Dependencies

- **Angular 18** (standalone components, signals) + **Angular CLI 18** — build/serve/test.
- **Angular Material 18** + **Angular CDK** — componentes UI y drag & drop (Kanban).
- **Chart.js 4 + ng2-charts 6** — gráficas del Dashboard y de la sección Material UI (**solo** se necesitan si esas páginas están activas).
- **JSZip + file-saver** — generación y descarga del ZIP; **solo** los usa el configurador, se eliminan del proyecto descargado.
- **Tabler Icons (CDN)** y **Plus Jakarta Sans (Google Fonts)** — iconografía y tipografía cargadas externamente (requieren red).

## Notes

- No hay backend ni persistencia real de datos: el auth es un token dummy en `localStorage` y las páginas muestran datos ficticios.
- El pipeline de descarga depende de un artefacto **auto-generado**: `scripts/embed-sources.mjs` (hooks `prestart`/`prebuild`) escribe `src/app/pages/settings/project-sources.ts` con todo el código fuente embebido; el configurador lo transforma en memoria y lo empaqueta.
- La documentación humana vive en `README.md` y `DOCUMENTACION.md` (no editar — son propiedad del autor). Estos archivos de metadata (`AGENTS/OBJECTIVES/DECISIONS/PROJECT_STATE/TASK_QUEUE/TOOLING/CLAUDE`) son la capa de control para agentes.
