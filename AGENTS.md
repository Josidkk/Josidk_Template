# Agent Router — josidk-template

Plantilla base de **dashboard/ERP administrativo en Angular 18** (Angular Material + Chart.js + Tabler Icons), personalizable sin código desde un configurador visual (`/settings`) que además **descarga el proyecto como ZIP** con la configuración aplicada, generado en el navegador. Las páginas de negocio son **demos con datos ficticios**.

Canonical model-agnostic instructions for agents working in this project.

## Canonical source of truth

Filesystem markdown control files in this project are canonical. Provider memories, chat history, Claude memory, Codex memory, and scheduled-agent local state are interfaces/cache only.

If provider memory conflicts with these files, trust the files and update the appropriate file after verifying facts against the code.

## Read order

1. `AGENTS.md` — canonical agent rules and source-of-truth policy.
2. `PROJECT_STATE.md` — current project reality.
3. `TASK_QUEUE.md` — durable task status/backlog.
4. `DECISIONS.md` — when architecture/history/known-bugs matter.
5. `TOOLING.md` — when choosing tools/capabilities.
6. `README.md` + `DOCUMENTACION.md` — human-facing overview and component/service API (author-owned; do not edit).

## File roles

- `PROJECT_STATE.md` summarizes current reality; it is not a backlog.
- `TASK_QUEUE.md` owns durable task IDs and statuses.
- `DECISIONS.md` owns durable decisions, rationale, and documented defects.
- `TOOLING.md` owns available tools and capabilities.
- `CLAUDE.md` is a Claude Code compatibility loader; it must not duplicate general policy.
- `README.md` and `DOCUMENTACION.md` are **author-owned human docs** — treat as read-only unless the owner explicitly asks to change them.

## Update policy

Before finalizing work, update changed reality:

- Update `PROJECT_STATE.md` when current phase/state changes.
- Update `TASK_QUEUE.md` when durable task status changes.
- Update `DECISIONS.md` for meaningful choices or newly found defects.
- Never write secrets. Redact suspected secrets as `[REDACTED]`.

## Project basics

- Owner: Grupo Platino (develop@grupoplatino.hn)
- Autor original / branding demo: Josidk / Deyby Josue (`src/app/core/config/app-config.ts`).
- Consumers: desarrolladores que necesitan un punto de partida de dashboard/ERP en Angular para rebrandear.
- Metadata added: 2026-07-04 (generada leyendo el código real).

## Stack

- **Framework:** Angular 18 — **componentes standalone**, **signals**, **lazy loading** por ruta (`loadComponent`), change detection `OnPush`. Sin NgModules.
- **UI:** Angular Material 18 + Angular CDK (drag & drop del Kanban). Iconos **Tabler** (CDN). Tipografía **Plus Jakarta Sans** (Google Fonts).
- **Gráficas:** Chart.js 4 + ng2-charts 6 (`provideCharts(withDefaultRegisterables())` en `app.config.ts`) — usadas por Dashboard y la sección Material UI.
- **Descarga del proyecto:** JSZip + file-saver, **solo** en el configurador; `scripts/embed-sources.mjs` (hooks `prestart`/`prebuild`) genera `src/app/pages/settings/project-sources.ts`.
- **Arranque:** `npm install` → `npm start` (`ng serve`, http://localhost:4200). `npm run build`, `npm test` (Karma/Jasmine). Login dummy: cualquier email/contraseña.

## Arquitectura y convenciones de código

- **Configuración centralizada:** marca y usuario en `src/app/core/config/app-config.ts` (`APP_CONFIG`). No hardcodear el nombre del sitio/usuario en componentes. (D-002)
- **Tema por variables CSS:** definir colores en `src/styles.scss` (`:root` claro / `body.dark-theme` oscuro). **Usar siempre `var(--...)`**, nunca `#fff`/`#000` fijos (preferir `#FDFAF5` / `#1A1208`). Para tarjetas, la clase global `.card-3d`, no `box-shadow` inline. (D-005; ver `DOCUMENTACION.md §2.3`)
- **Notificaciones:** usar `NotificationService` (`success/error/warning/info/loading/neutral`), **nunca** `CustomSnackbarComponent` directo.
- **Dark mode:** vía `ThemeService.isDark` (signal) / `toggle()`. Persiste en `localStorage['josidk-theme']`.
- **Auth:** `AuthGuard` solo comprueba `localStorage['josidk-token']`. Es dummy — no confiar en él como seguridad real. (D-003)
- **Añadir una página:** ruta (`app.routes.ts`) + entrada de sidebar (`sidebar.component.ts` → `menuSections`) + entrada de configurador (`settings.component.ts` → `availableModules`). Ver `DOCUMENTACION.md §5`.

## Anatomía de una página (patrón para calcar)

Toda página bajo `src/app/pages/<nombre>/` sigue **la misma forma**, para que copiar una y
adaptarla sea trivial. Al crear una página nueva, calca este esqueleto:

```
src/app/pages/<nombre>/
├── <nombre>.component.ts     ← lógica (standalone + OnPush + inject())
├── <nombre>.component.html   ← plantilla (templateUrl)
├── <nombre>.component.scss   ← estilos (styleUrl)
└── <nombre>.mock.ts          ← datos ficticios: interfaces + MOCK_* (solo si la página muestra datos)
```

Contrato del `.component.ts` (idéntico en todas las páginas de contenido):
- `standalone: true`, `changeDetection: ChangeDetectionStrategy.OnPush`.
- `templateUrl`/`styleUrl` (nunca `template:`/`styles:` inline).
- Imports a `shared/` y `core/` con profundidad `../../` (todas las páginas viven a 2 niveles).
- Dependencias vía `inject()` (p. ej. `private notify = inject(NotificationService)`).
- `breadcrumbs: BreadcrumbItem[]` empezando en `{ label: 'Inicio', route: '/' }` y `<app-breadcrumb>`
  como primer elemento de la plantilla; el contenido en tarjetas con la clase global `.card-3d`.
- **Los datos ficticios NO van en el componente**: viven en `<nombre>.mock.ts`, exportados como
  `MOCK_*` (+ sus `interface`), e importados. Un mock que se **muta en runtime** (drag&drop, push)
  se clona al asignarlo (`structuredClone(MOCK_X)`) para que cada instancia arranque fresca — ver
  `kanban`/`chat`. Reemplazar `MOCK_*` por una llamada HTTP es el único cambio para pasar a datos reales.

Excepciones intencionales (no siguen el contrato de "página de contenido"):
- `dashboard` — usa un encabezado de saludo propio en vez de breadcrumb.
- `auth/login`, `auth/register` — pantallas a página completa, fuera del layout principal.
- `material/*` — sección de demos agrupada en una sola carpeta (6 componentes hermanos), pero cada
  uno ya usa el mismo triángulo `.ts/.html/.scss` que el resto.

Para **registrar** la página nueva (ruta + sidebar + configurador), ver `DOCUMENTACION.md §5`
(no se duplica aquí). Recordatorio: tras crear archivos, `npm run embed` regenera `project-sources.ts`.

## Artefacto generado — NO editar a mano

- `src/app/pages/settings/project-sources.ts` es **auto-generado** por `scripts/embed-sources.mjs` (~11k líneas: todo el código fuente embebido para el ZIP). No editarlo; regenerar con `npm run embed`. (D-004)

## Defectos conocidos (ver DECISIONS.md)

Al reconstruir esta metadata (2026-07-04) se confirmaron defectos en el configurador. **No introducir regresiones y preferir arreglarlos** al tocar `settings.component.ts`:

- **D-006 / T-001:** `applyDefaultTheme()` — regex con paréntesis sin escapar → el «modo oscuro por defecto» se ignora en el ZIP (no-op silencioso).
- **D-007 / T-002:** `animationStyle` — se guarda en el config pero no se aplica a ninguna CSS var.
- **D-008 / T-003:** `cleanRoutes()` — el `redirectTo` usa el `id` del módulo, no su `path` (rompe si `material-ui-section` es el primer módulo).
- **D-009 / T-004:** solo la paleta persiste en `localStorage`; layout/tipografía/módulos/tema se pierden al recargar.

## Safety rules

- Do not treat provider-specific memory as canonical project truth.
- Do not create or preserve credentials, API keys, tokens, or private keys in repo files.
- Do not overwrite `README.md`, `DOCUMENTACION.md`, or existing project control files without explicit owner approval.
- Do not hand-edit `project-sources.ts` (regenerate it).
- Keep Claude-specific operational notes in `CLAUDE.md`; keep model-agnostic policy here.

## Tooling summary

See `TOOLING.md` for the tooling profile (skills / libraries / notes).
