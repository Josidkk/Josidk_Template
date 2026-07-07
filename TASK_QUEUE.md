# TASK_QUEUE — josidk-template

Working list of tasks. Group by phase. One task per line.

Convention:
- `[x]` done
- `[~]` in progress
- `[ ]` pending
- `[-]` deferred / superseded

---

## Phase 1 — Saldar defectos del configurador (destapados al documentar el código, 2026-07-04)

<!-- Cada tarea traza a una decisión en DECISIONS.md. Son los bugs/inconsistencias reales
     encontrados leyendo el código, no features nuevas. -->

- [ ] **T-001** Arreglar `SettingsComponent.applyDefaultTheme()`: escapar los paréntesis de `getItem('josidk-theme')` en el regex (o anclar a un fragmento estable) para que el «modo oscuro por defecto» realmente se aplique al `theme.service.ts` del ZIP. Añadir una comprobación de que el reemplazo ocurrió. *(D-006)*
- [ ] **T-002** Conectar `animationStyle` a un efecto real (p. ej. `none` → deshabilitar transiciones / `--transition-speed: 0s`) **o** retirarlo del UI y del config para no exponer un ajuste sin efecto. *(D-007)*
- [ ] **T-003** Corregir `SettingsComponent.cleanRoutes()`: derivar el `redirectTo` de la ruta hija vacía del **path** real del primer módulo (p. ej. `material/buttons` para `material-ui-section`), no de su `id`. *(D-008)*
- [ ] **T-004** Persistir en `localStorage` los ajustes que hoy solo viven en memoria (`layoutOptions`, `selectedFont`, `selectedModules`, `defaultTheme`) para que la vista previa sobreviva a un reload, igual que ya lo hace la paleta. *(D-009)*
- [ ] **T-006** Retirar la referencia muerta a `scripts/apply-config.mjs` en `removeEmbedArtifacts()` (el archivo no existe). *(D-010, baja prioridad)*

---

## Phase 2 — Camino a producción (para quien adopte la plantilla)

<!-- No son bugs: son los pasos que DOCUMENTACION.md §6 ya enumera para pasar de demo a producto real. -->

- [ ] **T-005** Reemplazar la autenticación dummy: auth real (JWT/API) en `AuthGuard`, interceptor HTTP que adjunte el token, y manejo de 401 (→ login) / 500 (→ notificar). *(D-003)*
- [ ] **T-007** Reemplazar los datos mock de las páginas demo (Dashboard, eCommerce, Kanban, Chat, Email, Calendario, Usuarios) por servicios HTTP contra un backend real.
- [ ] **T-008** Validar/estabilizar los `*.spec.ts` generados por el CLI (Karma/Jasmine) o retirarlos; hoy son andamiaje por defecto sin cobertura de la lógica real (configurador, servicios, guard).

---

## How to pick the next task

Empieza por la **Fase 1**: son defectos acotados y de alto valor, ya documentados en `DECISIONS.md`, buenos candidatos para `/fast-loop`. **T-001** y **T-003** son fixes de regex/lógica de bajo riesgo con impacto directo en la fidelidad del ZIP; **T-002** es una decisión (conectar vs. retirar); **T-004** mejora la UX del configurador; **T-006** es limpieza trivial. La **Fase 2** solo aplica cuando alguien adopte la plantilla para un producto real — no es trabajo de la plantilla en sí. Para cambios de UI/diseño, considera la skill `impeccable`; para verificar un fix del configurador end-to-end, `verify-agency`.
