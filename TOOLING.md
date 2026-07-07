---
project: josidk-template
generated: 2026-07-04
generator: hand-authored (reverse-engineered from source; brain-os discovery not run on this Mac)
stack: angular
---

# TOOLING — josidk-template

Claude Code surface area for this project — skills, libraries, and notes.

> **Nota:** este perfil se rellenó a mano leyendo el código real (no se ejecutó la discovery
> automática de `scaffold-project`/brain-os, que corre en Ubuntu). Para regenerarlo con discovery
> completa, ejecutar `scaffold-project` desde el entorno con acceso a brain-os.

The tooling profile is a descriptive capability registry only; it is NEVER acceptance evidence, a DONE signal, or a gate-relaxation input.

## Claude Code skills

Skills relevantes para trabajar en este proyecto:

- **`impeccable`** — para diseño/UI: páginas, layout, componentes, sistema de variables CSS (`styles.scss`), `.card-3d`, tema claro/oscuro.
- **`fast-loop`** — ideal para las tareas de la Fase 1 del `TASK_QUEUE.md` (fixes acotados del configurador con verificación objetiva).
- **`adversarial-code`** — para cambios no triviales (p. ej. reescribir el pipeline de transformación del ZIP).
- **`verify-agency`** — gate de verificación antes de cerrar un fix (especialmente descargar el ZIP y comprobar el archivo transformado).
- **`spec-adversarial-drafting`** — solo si se aborda una feature nueva grande (spec/plan/tasks). spec-kit **no** está inicializado hoy.
- **`agent-browser`** — para probar la app en el navegador (login, `/settings`, descarga del ZIP) con automatización.

## Recommended libraries (ya en uso)

- **@angular/core, common, router, forms, animations** (`^18.2`) — framework base (standalone + signals + lazy loading).
- **@angular/material + @angular/cdk** (`^18.2.14`) — componentes UI y drag & drop (Kanban).
- **chart.js** (`^4.5.1`) + **ng2-charts** (`^6.0.1`) — gráficas (Dashboard, Material UI). Solo necesarias si esas páginas están activas; el configurador las elimina del ZIP si no se usan.
- **jszip** (`^3.10.1`) + **file-saver** (`^2.0.5`) — generación/descarga del ZIP en el navegador. **Solo** las usa el configurador; se eliminan del proyecto descargado.
- **rxjs** (`~7.8`), **zone.js** (`~0.14`), **tslib** — runtime Angular.
- **DevDeps:** @angular/cli + @angular-devkit/build-angular (`^18.2.17`), typescript (`~5.5.2`), Karma + Jasmine (test).

## External runtime dependencies (requieren red)

- **Tabler Icons** vía CDN (clases `ti ti-*`).
- **Plus Jakarta Sans** vía Google Fonts.

## Build tooling propio

- **`scripts/embed-sources.mjs`** (Node ESM) — recorre `src/` + `public/` + archivos raíz y genera `src/app/pages/settings/project-sources.ts` (texto embebido + binarios en Base64). Hooks npm: `embed`, `prestart`, `prebuild`. El artefacto generado **no se edita a mano**.

## MCP servers

Ninguno configurado para este proyecto.

## Notes

- Sin backend ni persistencia real: auth dummy (token en `localStorage`) y datos de página ficticios.
- `project-sources.ts` es grande (~11k líneas) y auto-generado — ignorar en revisiones de código, regenerar con `npm run embed`.
- Ver `DECISIONS.md` para los defectos conocidos del configurador (D-006..D-010).
