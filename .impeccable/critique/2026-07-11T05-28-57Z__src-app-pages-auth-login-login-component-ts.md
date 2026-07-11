---
target: login (pantalla de inicio de sesión)
total_score: 24
p0_count: 1
p1_count: 2
timestamp: 2026-07-11T05-28-57Z
slug: src-app-pages-auth-login-login-component-ts
---
# Critique — Login (src/app/pages/auth/login)

## Design Health Score

| # | Heurística | Score | Issue clave |
|---|-----------|-------|-----------|
| 1 | Visibilidad del estado del sistema | 1 | Sin estado loading/disabled en el submit; estilos `:disabled` son código muerto |
| 2 | Match sistema / mundo real | 4 | Sólido — español natural, mensajes de error humanos |
| 3 | Control y libertad del usuario | 1 | "¿Olvidaste tu contraseña?" es `href="#"` — enlace muerto que recarga/salta |
| 4 | Consistencia y estándares | 3 | Buena consistencia con register; error de términos en register usa estilos inline fuera del sistema |
| 5 | Prevención de errores | 2 | Sin toggle de ver contraseña; validación solo tras primer submit |
| 6 | Reconocimiento antes que recuerdo | 3 | Labels visibles + iconos; placeholder `••••••••` es ruido |
| 7 | Flexibilidad y eficiencia | 3 | Enter envía, autofill bien resuelto; sin atajos/SSO (aceptable) |
| 8 | Diseño estético y minimalista | 3 | Limpio y jerárquico; dot pulsante infinito sin significado; `min-height:800px` fuerza scroll en 768px |
| 9 | Recuperación de errores | 2 | Errores inline correctos pero sin ARIA (invisibles a lectores de pantalla) y a ~10.9px reales |
| 10 | Ayuda y documentación | 2 | Microcopy guía suficiente para un login |
| **Total** | | **24/40** | **Aceptable — mejoras significativas necesarias** |

## Anti-Patterns Verdict

**LLM:** Por encima del slop medio — sin gradient text, sin glass decorativo, sin side-stripes; la ilustración sepia + "Bienvenido." editorial tiene carácter real y cumple la personalidad "cálida/premium". Pero la composición (panel crema + hero ilustrado + chip pill con dot pulsante + tagline) es el default del split-screen 2025-2026, ejecutado con gusto, no reimaginado. Lo grave no es estético: los grises están calibrados por sensación, no por contraste.

**Detector (determinista):** 1 hallazgo — `overused-font` (warning) en `login.component.scss:456`: Plus Jakarta Sans en `.deco-title` (fuente sobreusada en UIs generadas por IA). No es falso positivo, pero es decisión de marca de TODA la plantilla, no del login; se cambia globalmente vía `--font-family`. Prioridad baja como issue del login.

**Overlays de browser:** no disponibles en esta máquina (sin browser automation); evidencia solo por CLI + lectura de código.

## Issues prioritarios

- **[P0] Contraste AA roto en tema claro** — tokens globales `--text-secondary: rgba(0,0,0,0.42)` (≈3.0:1) y `--text-muted: rgba(0,0,0,0.28)` (placeholder ≈2.0:1) en `styles.scss:67-68`; links `#9A8560` ≈3.4:1 a ~11.8px; hover del CTA blanco sobre `#9A8560` ≈3.05:1. Viola el propio PRODUCT.md (AA 4.5:1). Y hereda a TODAS las pantallas. Fix: subir a ≈0.60/0.46, `--accent-warm-darker` para links pequeños, hover del botón hacia lighten de `--primary`. → `/impeccable colorize` o fix directo de tokens.
- **[P1] Sin estado loading/disabled en submit** (`login.component.ts:37-47`) — patrón que todos los adoptantes calcarán con auth real → doble submit, cero feedback. Fix: `isLoading` + disabled + texto "Ingresando…". → `/impeccable harden`
- **[P1] Errores invisibles para AT** — sin `aria-invalid`/`aria-describedby`/`role="alert"` (`login.component.html:28-53`). Fix: cablear ARIA a los `.field-error`. → `/impeccable harden` o `/impeccable audit`
- **[P2] Enlace muerto "¿Olvidaste tu contraseña?"** (`href="#"`, html:61). Fix: ruta demo `/forgot-password` o retirar. → `/impeccable harden`
- **[P2] Sin toggle ver-contraseña y sin `prefers-reduced-motion` en todo src/** (pulseDot infinito, bgFadeIn). Fix: botón ojo accesible + bloque global reduced-motion en `styles.scss`. → `/impeccable harden` / `/impeccable animate`
- **[P3] `min-height:800px`** (`login.component.scss:25`) fuerza scroll en laptops 1366×768. Fix: `min(800px, calc(100vh - 40px))`. → `/impeccable adapt`

## Persona Red Flags

- **Jordan (first-timer):** no puede verificar la contraseña escrita; error en ~10.9px; el link de recuperación salta al top sin ir a ningún lado — tres golpes de confianza en el primer minuto.
- **Sam (AT/teclado/baja visión):** submit inválido no anuncia nada; placeholder ≈2:1 ilegible; primer tab cae en el toggle de tema (icon-only, solo `title`) antes que el email; animación infinita ignora reduced-motion.
- **Casey (móvil):** flujo móvil bien resuelto (hero 280px + sheet), pero tras submit con teclado abierto los errores quedan fuera del viewport (sin scroll-to-error/focus al inválido).

## Observaciones menores

- Placeholder `••••••••` en password: mejor sin placeholder.
- `deco-subtitle` claro: rgba(0,0,0,0.42) sobre imagen con overlay 6-20% — contraste impredecible.
- Checkbox `accent-color` nativo: único control "sin diseñar" de la tarjeta.
- `.btn-submit` sin `:focus-visible` propio (outline nativo, inconsistente con el ring de inputs).
- `console.log('Login attempt:', email)` en producción de plantilla.
- Fondo derecho `#F8F3EB` hardcodeado (`login.component.scss:355`) — viola D-005 (var(--...)); con paleta fría rebrandeada, la ilustración sepia queda desalineada.
- Error de términos en register con estilos inline negativos (html:76).

## Preguntas

1. ¿La calidez debe vivir en el alfa del gris o en el hue? Un `#5C5348` cálido casi opaco daría la misma emoción y pasaría AA.
2. El login es lo primero que ve quien evalúa la plantilla: ¿qué dice que su primer link sea `href="#"` y su botón no tenga loading?
3. El pico emocional ("Bienvenido." 72px) ocurre antes de interactuar — ¿cómo darle al submit→dashboard un final equivalente?
