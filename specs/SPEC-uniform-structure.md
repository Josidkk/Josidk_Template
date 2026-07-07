# Spec: Estructura uniforme y "calcable" (refactor sin cambio visual)

## Goal
Toda página de `src/app/pages/` tiene la misma anatomía de archivos (folder + `.ts`/`.html`/`.scss` con `templateUrl`/`styleUrl`), los datos ficticios viven en `<page>.mock.ts` co-locados, y el patrón queda documentado — con el build verde, el configurador intacto y **cero cambio visual**.

## Non-goals
- No cambiar diseño, estilos, HTML renderizado ni comportamiento de ninguna página.
- No tocar `README.md`, `DOCUMENTACION.md`, `styles.scss` ni ningún SCSS/HTML de diseño existente (solo mover/renombrar, no reestilizar).
- No arreglar los bugs del configurador (D-006..D-010) — eso es otra tarea.
- No extraer mocks de las páginas `material/*` (su data es ilustrativa del demo).

## Constraints
- Angular 18 standalone. Tocar solo: `pages/users/**`, `pages/material/material-*.component.*`, nuevos `pages/*/**.mock.ts`, `app.routes.ts`, `pages/settings/settings.component.ts`, `shared/sidebar/sidebar.component.ts`, `AGENTS.md`.
- `project-sources.ts` NO se edita a mano; se regenera con `npm run embed`.
- Los imports de material deben seguir resolviendo `./pages/material/material-<x>.component` (no romper `settings.component.ts` cleanRoutes).

## Checklist  ← every item MUST name its verifier
- [x] Página `pages/users/users.component.{ts,html,scss}` (sin `user-list/`), `UsersComponent`, `app-users`, imports `../../`. — **PASS** (verificador exit 0).
- [x] `app.routes.ts` + `settings.component.ts` → `./pages/users/users.component` + `UsersComponent`, sin `user-list`. — **PASS**.
- [x] Las 6 `material/*` usan `templateUrl`+`styleUrl`, con sus `.html`/`.scss`. — **PASS**. Además byte-diff vs git HEAD: contenido IDÉNTICO (solo difiere una línea en blanco inicial que Angular normaliza → cero efecto visual).
- [x] `sidebar.component.ts` + `sidebarMap` usan id `'users'` (no `'usuarios'`). — **PASS**.
- [x] `<page>.mock.ts` co-locados en las 8 páginas de negocio con `MOCK_*`; componentes importan de `./<page>.mock`. Mocks mutados in-place (kanban, chat) clonados con `structuredClone`. — **PASS** (8 mocks: dashboard, ecommerce, users, kanban, chat, email, calendar, profile).
- [x] `npm run build` **exit 0**; solo 11 warnings pre-existentes (presupuesto SCSS + CommonJS jszip/file-saver), ningún error. — **PASS** (`build exit: 0`).
- [x] `project-sources.ts` regenerado embebe `pages/users/users.component` + material con `.html`, sin `user-list`, con los 8 `.mock.ts`. — **PASS**.
- [x] `AGENTS.md` tiene sección "Anatomía de una página". — **PASS**.
- [x] Diseño intacto: `README.md`, `DOCUMENTACION.md`, `styles.scss` sin cambios. — **PASS** (git diff vacío).

Extra (verificación del plan): `npx ng test --watch=false --browsers=ChromeHeadless` → 4 pass / 6 fail. Los 6 fallos son `NullInjectorError: No provider for ActivatedRoute` en specs boilerplate del CLI (login/sidebar/register/main-layout/app/users) que nunca configuraron el router — **pre-existentes** (los specs de login/sidebar no se tocaron y fallan igual). No es regresión; ya registrado como T-008 en TASK_QUEUE.md.

## Deferred
(vacío)
