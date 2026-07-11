# Product

## Register

product

## Users

- **Primarios:** desarrolladores (principalmente Angular) que adoptan la plantilla como punto de partida de un panel admin/ERP/CRM y la rebrandean para su empresa. Contexto: quieren ahorrarse semanas de layout/theming y calcar patrones existentes.
- **Secundarios:** los usuarios finales de esos paneles — personal administrativo que trabaja horas dentro de la app (tablas, formularios, dashboards), normalmente en escritorio, en oficina con luz ambiente normal.

## Product Purpose

Plantilla base de dashboard/ERP en Angular 18 (Material + Chart.js + Tabler Icons) personalizable sin código desde `/settings`, con descarga del proyecto como ZIP generado en el navegador. Las páginas de negocio son demos con datos ficticios. Éxito = que un dev la adopte, la rebrandee editando `app-config.ts` + una paleta, y calque sus patrones de página sin pelearse con el diseño.

## Brand Personality

Cálida, elegante, premium. La identidad demo "Josidk" (cremas/marrones, acento dorado, sensación editorial) es el escaparate de lo que la plantilla puede ser — debe sentirse artesanal y cuidada, no genérica. La calidez la llevan el acento, la tipografía (Plus Jakarta Sans) y los detalles (`.card-3d`, micro-transiciones), no solo el fondo.

## Anti-references

- **Angular Material "stock":** que se note el indigo/pink por defecto, elevaciones y densidad sin personalizar. Material es la base funcional, nunca la estética visible.
- **Admin Bootstrap genérico** (AdminLTE/CoreUI): tablas grises, cards planas idénticas, cero identidad.
- **Dashboard oscuro "gamer/crypto":** neones, glassmorphism decorativo por todos lados, gradientes sin propósito.

## Design Principles

1. **La plantilla es el portafolio.** Cada pantalla demo debe verse lista para enseñar a un cliente; si una página se ve "de relleno", daña el producto entero.
2. **Tema por variables, siempre.** Todo color pasa por `var(--...)` de `styles.scss` (claro y oscuro); nada hardcodeado. Es lo que hace real la promesa de rebrandear.
3. **Patrones para calcar, no para admirar.** Cada página sigue la misma anatomía (`.ts/.html/.scss/.mock.ts`); la consistencia estructural vale más que la originalidad puntual.
4. **Cálido sin sacrificar legibilidad.** La elegancia no justifica texto gris lavado ni contrastes al límite — es una herramienta de trabajo de 8 horas diarias.
5. **El dark mode es primera clase.** Cada decisión visual se verifica en ambos temas; `body.dark-theme` no es una ocurrencia tardía.

## Accessibility & Inclusion

- **WCAG AA:** contraste ≥4.5:1 en texto normal (incluidos placeholders), ≥3:1 en texto grande e iconografía informativa.
- Focus visible en todos los interactivos; navegación completa por teclado en formularios y diálogos.
- `prefers-reduced-motion` respetado en transiciones/animaciones globales.
