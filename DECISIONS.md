# DECISIONS — josidk-template

Architecture Decision Records. Immutable log of the choices we made and why.
When a decision is superseded, the new one references the old. Status:
ACCEPTED unless noted.

Convention:
- One decision per `## D-NNN: <title>` heading.
- Every decision has a `**Date:**`, `**Decision:**`, `**Rationale:**`, and
  `**Consequence:**` block.
- Entries tagged **DEFECTO** document a bug/inconsistency found in the real code
  while reverse-engineering this metadata (2026-07-04). They are NOT design
  intent — they trace to a task in `TASK_QUEUE.md`.

---

## D-001: Angular 18 standalone + signals + lazy loading

**Date:** 2026-07-04

**Decision:** La app usa **componentes standalone** (sin NgModules), **Angular signals** para estado reactivo y **lazy loading por ruta** (`loadComponent`) para todas las páginas. Change detection `OnPush` en los componentes con lógica.

**Rationale:**
- Verificado en `src/app/app.routes.ts` (todas las rutas usan `loadComponent`), `app.config.ts` (`provideRouter` + `PreloadAllModules`), y servicios/componentes que usan `signal()`/`computed()` (`ThemeService`, `SidebarConfigService`, `SettingsComponent`).
- El bundle inicial solo carga el layout + componentes compartidos; cada página llega bajo demanda.

**Consequence:** Al añadir una página se registra su ruta con `loadComponent` en `app.routes.ts`, se añade al sidebar (`sidebar.component.ts` → `menuSections`) y, si debe ser configurable, al array `availableModules` de `settings.component.ts`. Ver `DOCUMENTACION.md §5`.

---

## D-002: Configuración de marca y usuario centralizada en `app-config.ts`

**Date:** 2026-07-04

**Decision:** Todo el branding y el usuario demo viven en `src/app/core/config/app-config.ts` (`APP_CONFIG`, `as const`). Sidebar, navbar, perfil, footer y el título del navegador (`app.component.ts` → `Title.setTitle`) leen de ahí.

**Rationale:**
- Un solo punto de edición para rebrandear sin tocar componentes.
- Confirmado: `AppComponent`, `SidebarComponent` (y por doc también profile/footer) importan `APP_CONFIG`.

**Consequence:** Rebrandear = editar un archivo. `siteName`, `siteFullName`, `user.*` y `skills[]` son la fuente. (Nota: los colores NO viven aquí — ver D-005.)

---

## D-003: Autenticación dummy (token en `localStorage`) — reemplazar en producción

**Date:** 2026-07-04

**Decision:** El acceso está protegido por `AuthGuard` (`core/guards/auth.guard.ts`), que **solo comprueba que exista `localStorage['josidk-token']`**. `LoginComponent` y `RegisterComponent` aceptan cualquier email/contraseña válidos por formato y escriben el token literal `'dummy-jwt-token'`. `logout()` en el sidebar lo borra.

**Rationale:**
- Es una plantilla: el objetivo es una demo navegable sin backend.
- El propio código lo marca con `// TODO: Replace with real auth service and store actual JWT token`.

**Consequence:** **No apto para producción tal cual.** Migrar requiere: auth real (JWT/API) en `AuthGuard`, un interceptor HTTP que adjunte el token, y manejo de 401/500. Registrado como T-005. Ver también `DOCUMENTACION.md §6`.

---

## D-004: El configurador genera el proyecto ZIP **en el navegador** (embed → transform → zip)

**Date:** 2026-07-04

**Decision:** «Descargar Proyecto» (`SettingsComponent.downloadTemplate`) construye un ZIP del proyecto completo **client-side**, sin backend, en tres etapas:
1. **Embed (build-time):** `scripts/embed-sources.mjs` (hooks npm `prestart`/`prebuild`) recorre `src/` + `public/` + archivos raíz y escribe `src/app/pages/settings/project-sources.ts` con el contenido de cada archivo (texto en template literals, binarios en Base64).
2. **Transform (runtime):** el configurador clona ese mapa y aplica transformaciones en memoria (colores, layout, páginas excluidas, rutas, sidebar, deps, etc.).
3. **Zip (runtime):** empaqueta con **JSZip** y descarga con **file-saver**, añadiendo `josidk-config.json` (respaldo) y `LEEME.md`.

**Rationale:**
- Permite entregar un proyecto ya personalizado sin servidor ni build step para el usuario final.
- Verificado en `settings.component.ts` (`downloadTemplate` + helpers `applyThemeColors`, `cleanRoutes`, `cleanSidebar`, `cleanDependencies`, `removeExcludedPages`, …) y en `embed-sources.mjs`.

**Consequence:** `project-sources.ts` es un artefacto **auto-generado** (~11k líneas, no editar a mano — se regenera con `npm run embed`). `jszip`/`file-saver`/`@types/file-saver` y los hooks de embed solo existen para esta feature y el propio configurador los elimina del proyecto descargado (`cleanDependencies`, `removeSettingsPage`, `removeEmbedArtifacts`). Las transformaciones son **frágiles por diseño** (reescritura de texto por regex sobre el código) — de ahí varios defectos: D-006, D-007, D-008.

---

## D-005: Sistema de diseño por variables CSS + inyección de `<style>` en runtime

**Date:** 2026-07-04

**Decision:** El tema se define con **variables CSS** en `src/styles.scss` (`:root` = claro, `body.dark-theme` = oscuro). El configurador aplica una paleta creando/reemplazando un `<style id="josidk-palette-theme">` inyectado en `<head>` (`SettingsComponent.applyPalette`). El layout (ancho de sidebar, radio, velocidad) se aplica con `document.documentElement.style.setProperty(...)`.

**Rationale:**
- Permite vista previa en vivo sin recompilar y traspasar la paleta al ZIP reescribiendo `styles.scss`.
- Convención del proyecto: usar siempre `var(--...)`, nunca `#fff`/`#000` fijos, y `.card-3d` para tarjetas (ver `DOCUMENTACION.md §2.3`).

**Consequence:** Solo la **paleta activa** y la **paleta personalizada** se persisten en `localStorage` (`josidk-active-palette`, `josidk-custom-palette`); el resto de ajustes del configurador NO (ver D-009). La tematización descargada depende de reescribir `styles.scss` por regex (`replaceCSSVar`), lo que es sensible a cambios de formato en ese archivo.

---

## D-006: **DEFECTO** — el «modo oscuro por defecto» se ignora en el proyecto descargado

**Date:** 2026-07-04

**Decision (defecto confirmado):** El ajuste *Tema por defecto* (`light`/`dark`/`system`) elegido en `/settings` **no tiene ningún efecto** en el ZIP descargado. `SettingsComponent.applyDefaultTheme()` intenta reescribir `theme.service.ts` con:

```ts
const oldLogic = "const saved = localStorage.getItem('josidk-theme');\\s*if \\(saved === 'dark'\\) \\{";
themeService.content = themeService.content.replace(new RegExp(oldLogic, 'g'), newLogic);
```

Los paréntesis de `getItem('josidk-theme')` **no están escapados**, así que el motor de regex los interpreta como un grupo de captura y el patrón nunca coincide con el código real.

**Rationale:**
- Reproducido empíricamente (2026-07-04): `new RegExp(oldLogic,'g').test(theme.service.ts)` → **`false`**. El `.replace()` es un no-op silencioso; no lanza error, así que la descarga «tiene éxito» pero con el `ThemeService` original.
- Efecto: el proyecto descargado siempre arranca en claro (salvo lo guardado en `localStorage` del usuario final), sin importar lo elegido.

**Consequence:** Corregir escapando los paréntesis (p. ej. reutilizar `escapeRegex`) o anclando el reemplazo a un fragmento estable. Registrado como **T-001**. Añadir una aserción de que el reemplazo realmente ocurrió evitaría regresiones silenciosas.

---

## D-007: **DEFECTO** — `animationStyle` se captura y se guarda pero nunca se aplica

**Date:** 2026-07-04

**Decision (defecto confirmado):** El campo `animationStyle` (`'normal' | 'fast' | 'none'`) existe en `layoutOptions`, en los `layoutPresets` y se serializa en `josidk-config.json`, pero **no está conectado a ninguna variable CSS ni comportamiento**. `applyLayoutPreset()` aplica `--sidebar-width`, `--content-radius`, `--transition-speed`, etc., pero **nunca** `animationStyle`.

**Rationale:**
- `grep animationStyle` solo lo encuentra en definiciones/tipos/config; `grep animation-style|--animation` en `src/` no arroja **ninguna** referencia de consumo.
- Es un ajuste «muerto»: el usuario puede cambiarlo pero no ocurre nada (ni en preview ni en el ZIP). `transitionSpeed` sí funciona, lo que hace el vacío menos evidente.

**Consequence:** O bien mapear `animationStyle` a un efecto real (p. ej. `none` → `--transition-speed: 0s` / deshabilitar animaciones globalmente), o retirarlo del UI y del config para no prometer algo que no hace. Registrado como **T-002**.

---

## D-008: **DEFECTO (edge case)** — `cleanRoutes` usa el `id` del módulo como destino del redirect

**Date:** 2026-07-04

**Decision (defecto confirmado por lectura):** Al reconstruir `app.routes.ts` para el ZIP, el redirect por defecto de la ruta hija vacía se genera con el **id** del primer módulo seleccionado, no con su **path** de ruta:

```ts
const firstChild = config.modules.selected.find(m => !authPages.has(m.id));
const firstRoute = firstChild ? firstChild.id : 'dashboard';   // usa .id
...
redirectTo: '${firstRoute}',
```

Para casi todos los módulos `id === path`, así que funciona. **Excepto `material-ui-section`**, cuyo `id` es `'material-ui-section'` pero cuyas rutas reales son `material/buttons`, etc. Si ese fuese el primer (o único) módulo seleccionado, el ZIP generaría `redirectTo: 'material-ui-section'`, una ruta inexistente → caería en el `**` (not-found).

**Rationale:**
- Inconsistencia `id`-vs-`route` localizada en el mapeo de `availableModules`/`routeMap`. Solo se manifiesta en una combinación de selección poco común (Material UI como primera página protegida sin Dashboard/eCommerce/… delante), por eso es *edge case* y no un fallo del caso típico.

**Consequence:** Derivar `firstRoute` del `path` real del módulo (p. ej. `material/buttons` para `material-ui-section`) en lugar del `id`. Registrado como **T-003**.

---

## D-009: **INCONSISTENCIA** — solo la paleta persiste; layout/tipografía/módulos/tema se pierden al recargar

**Date:** 2026-07-04

**Decision (inconsistencia confirmada):** En `/settings`, únicamente la paleta activa y la personalizada se guardan en `localStorage`. `layoutOptions` (ancho, radio, velocidad, `animationStyle`), `selectedFont`, `selectedModules` y `defaultTheme` viven solo en memoria (signals) y se aplican vía estilos inline en `documentElement`, que se resetean al recargar o navegar fuera.

**Rationale:**
- El constructor de `SettingsComponent` solo rehidrata `josidk-custom-palette` y `josidk-active-palette`. No hay lectura/escritura de los demás ajustes.
- Efecto UX: el usuario ajusta layout/fuente/módulos, recarga, y ve todo salvo la paleta revertido a los valores por defecto. La selección **sí** se respeta si descarga en la misma sesión (los signals siguen vivos), pero no sobrevive un reload.

**Consequence:** Persistir el resto de ajustes en `localStorage` (o un único blob `josidk-settings`) para que la vista previa sea estable entre sesiones. Registrado como **T-004**. Es una inconsistencia de UX, no un fallo de la descarga.

---

## D-010: **LIMPIEZA menor** — referencia muerta a `scripts/apply-config.mjs`

**Date:** 2026-07-04

**Decision:** `removeEmbedArtifacts()` intenta borrar del ZIP `scripts/apply-config.mjs`, un archivo que **no existe** en el proyecto (solo existe `scripts/embed-sources.mjs`).

**Rationale:**
- Es inofensivo (borrar una clave inexistente del `Map` no hace nada), pero delata código heredado de un pipeline anterior y confunde sobre qué scripts existen.

**Consequence:** Retirar la referencia muerta al limpiar el configurador. Registrado como **T-006** (baja prioridad).

---

## D-011: **DEFECTO corregido** — contraste WCAG AA roto en los tokens de texto del tema claro

**Date:** 2026-07-11

**Decision:** Los tokens de texto del tema claro violaban WCAG AA y se corrigieron cambiando **alfa por hue** (gris cálido opaco, manteniendo la personalidad de la marca): `--text-secondary` `rgba(0,0,0,0.42)` (≈3.0:1) → `#5C5348` (≈6.7:1) y `--text-muted` `rgba(0,0,0,0.28)` (≈2.0:1, placeholders) → `#6E6659` (≈5.1:1) en `styles.scss`. Las 7 paletas claras del configurador (`settings.component.ts`) también definían `--text-secondary` a alfa 0.40–0.45 y se subieron a 0.65–0.70 (≈5.4–7.0:1) para que el fix sobreviva al cambio de paleta y al ZIP. En login/register, los links pequeños (`#9A8560` ≈3.4:1) y el hover del CTA (blanco sobre `#9A8560` ≈3.6:1) se corrigieron con `color-mix()` sobre variables existentes (`58% accent-warm-dark + text-primary` ≈6.9:1; `85% primary + white` ≈12:1), sin tokens nuevos, para que se auto-adapten a cualquier paleta.

**Rationale:**
- Detectado en el critique de diseño del login (2026-07-11, snapshot en `.impeccable/critique/`); ratios verificados con cálculo WCAG programático antes y después.
- Se descartó añadir un token `--accent-warm-darker` porque las paletas del configurador y `custom-color-dialog` no lo tematizarían; `color-mix()` en el punto de uso respeta el sistema existente.
- El tema oscuro ya cumplía AA y no se tocó.

**Consequence:** No aclarar estos tokens por debajo de 4.5:1 (hay comentarios en `styles.scss` marcándolo). Pendientes del mismo critique (P1/P2): loading/ARIA del login, link muerto de "¿olvidaste tu contraseña?", toggle de contraseña, `prefers-reduced-motion` global — registrados como **T-009**.

---

## D-012: Login/Register a pantalla completa (full-bleed split), sin marco de tarjeta

**Date:** 2026-07-11

**Decision:** Las pantallas de auth dejan de ser una tarjeta flotante que contiene un split-screen y pasan a ser el split **a pantalla completa**: `.login-split-layout` ocupa `100vh` sin `max-width`/`border-radius`/sombras, el panel del formulario usa `flex-basis: clamp(420px, 34vw, 560px)` con `overflow-y: auto`, y `.login-card` se centra con `margin: auto 0` (centrado idéntico al de `align-items: center` pero que no recorta el tope cuando el contenido desborda). Aplicado por igual en `login.component.scss` y `register.component.scss`.

**Rationale:**
- El marco anterior (`max-width: 1200px; min-height: 800px; border-radius: 24px`) se recortaba en viewports de menos de ~840px de alto porque el `body` global lleva `overflow: hidden` — la tarjeta simplemente se cortaba sin scroll (reportado por el owner con screenshot, 2026-07-11).
- El media query móvil ya iba full-bleed; desktop y móvil usaban dos lenguajes distintos. Unificar simplificó el propio media query (la mitad de sus resets deshacían el marco).
- Full-bleed es el patrón de familiaridad del split-screen (registro *product*), y la ilustración/`deco-title` ganan presencia.
- Validado visualmente por el owner ("está perfecto").

**Consequence:** El scroll en pantallas bajas es interno del panel del formulario (importante en register, que es más largo); en móvil ahora scrollea el wrapper (`height: 100vh; overflow-y: auto`), lo que además arregla el recorte con teclado abierto. Para volver al marco de tarjeta: restaurar en `.login-split-layout` los valores documentados arriba y el padding de 20px del wrapper.

---

## D-013: Convenciones responsive móvil (establecidas en el auth, aplicables a toda la plantilla)

**Date:** 2026-07-11

**Decision:** El auth (login/register) fija las convenciones móviles de la plantilla:
1. **Alturas de viewport con `100dvh` + fallback `100vh`** (dos declaraciones consecutivas): `100vh` en móvil incluye la barra del navegador y recorta/descentra.
2. **Inputs a `font-size: 16px` mínimo en móvil**: por debajo, iOS Safari hace auto-zoom al enfocar.
3. **Targets táctiles ≥44px**: padding vertical en links inline (agranda el área de toque sin mover layout), toggles a 44px.
4. **Safe areas**: `viewport-fit=cover` en `index.html` + `env(safe-area-inset-*)` con `max()` para notch/home indicator.
5. **`@media (hover: none)`** para neutralizar efectos hover que quedan pegados tras el tap.
6. **Landscape corto** (`max-width: 900px and max-height: 500px`): los elementos decorativos ceden el alto al contenido funcional.
7. **Submit inválido → `focus()` al primer campo con error** (login/register `.component.ts`): con el teclado abierto el mensaje puede quedar fuera del viewport.

**Rationale:** Salidas del critique del login (persona móvil) y de la pasada `adapt` (2026-07-11). Son los fallos móviles más comunes de plantillas admin y todos son baratos de calcar en páginas nuevas.

**Consequence:** Al crear páginas nuevas o tocar las demo existentes, seguir estas convenciones (especialmente 1, 2 y 3 en cualquier formulario). El resto de páginas demo aún no las aplican sistemáticamente — auditoría pendiente si se quiere uniformidad total.
