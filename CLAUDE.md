# Claude Code Loader — josidk-template

Claude Code auto-loads this file. It is a thin adapter — **the canonical, model-agnostic source of truth is `AGENTS.md`**. Load `AGENTS.md` before making any project decision.

## Goal

Plantilla base de dashboard/ERP en Angular 18 (Material + Chart.js + Tabler Icons), personalizable sin código desde `/settings`, con descarga del proyecto como ZIP generado en el navegador. Las páginas de negocio son demos con datos ficticios.

## What to do first

1. Read `AGENTS.md` and follow the read order it specifies.
2. Read `PROJECT_STATE.md` and `TASK_QUEUE.md` for where things stand.
3. Treat anything in this file other than Claude-Code-specific operational notes as non-canonical.

## Conflict rule

If this file conflicts with `AGENTS.md`, `AGENTS.md` wins. Do not duplicate general policy here.

## Claude-specific notes

- **Correr la app:** `npm install && npm start` → http://localhost:4200. Login dummy: cualquier email válido + contraseña ≥6 chars. `npm run build`, `npm test`.
- **Regenerar el embed:** tras cambiar código fuente, `npm run embed` reescribe `src/app/pages/settings/project-sources.ts` (también corre en `prestart`/`prebuild`). **No editar ese archivo a mano.**
- **No tocar** `README.md` ni `DOCUMENTACION.md` sin permiso explícito del owner — son documentación humana propiedad del autor.
- **Diseño/UI:** para cambios visuales, cargar la skill `impeccable`; respetar el sistema de variables CSS (`styles.scss`) y `.card-3d` (ver `AGENTS.md` → convenciones).
- **spec-kit NO está inicializado** en este proyecto (no hay `.specify/`). Si se aborda una feature grande, valorar `spec-adversarial-drafting`; para fixes pequeños, `fast-loop`.
- **Bugs conocidos abiertos** (destapados al documentar el código, ver `TASK_QUEUE.md` / `DECISIONS.md`): (T-001) el «modo oscuro por defecto» del configurador no llega al ZIP por un regex roto; (T-002) `animationStyle` no hace nada; (T-003) `cleanRoutes` usa `id` en vez de `path` en el redirect; (T-004) solo la paleta persiste al recargar `/settings`.
- **Verificar un fix del configurador end-to-end:** descargar el ZIP desde `/settings` y comprobar el archivo transformado (p. ej. `theme.service.ts` para T-001, `app.routes.ts` para T-003). Considerar la skill `verify-agency` como gate.
