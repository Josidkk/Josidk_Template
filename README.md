# Josidk ERP Template

> **Angular 18** · **Angular Material** · **Chart.js** · **Tabler Icons**
> Dashboard administrativo moderno, modular y listo para personalizar.

---

## En 30 segundos

```bash
npm install
npm start        # -> http://localhost:4200
```

Inicia sesion en `/login` con cualquier email y contrasena.

---

## Que incluye?

| Para que | Que hay |
|---|---|
| **Ver datos** | Dashboard con graficas (Chart.js), tabla de usuarios, eCommerce con CRUD |
| **Gestionar tareas** | Kanban con drag & drop, calendario de eventos |
| **Comunicacion** | Chat, Email (interfaces demo) |
| **Autenticacion** | Login + Register (opcionales en el configurador) |
| **UI Components** | 6 paginas con ejemplos de Angular Material |
| **Componentes reutilizables** | Sidebar, Navbar, Breadcrumb, ConfirmDialog, NotificationService |

---

## Personalizacion (sin tocar codigo)

Entra a **Configuracion** (`/settings`) y puedes:

- **Paletas de color** — 6 temas predefinidos + editor personalizado (vista previa en vivo)
- **Modulos** — Activa/desactiva paginas. Login es obligatorio, Register opcional
- **Layout** — Ancho del sidebar, radio de bordes, velocidad de animacion, tipografia
- **Tema oscuro** — Claro, oscuro o seguir el sistema (por defecto)

Cuando termines, **Descargar Proyecto** genera un ZIP listo para usar.

---

## Personalizacion (editando codigo)

### Marca, usuario y datos demo

Todo en un solo archivo: `src/app/core/config/app-config.ts`

```typescript
export const APP_CONFIG = {
  siteName: 'Tu Empresa',
  siteFullName: 'Tu Empresa ERP',
  user: {
    name: 'Tu Nombre',
    email: 'tu@email.com',
    role: 'Admin',
    initials: 'TN',
  },
  skills: [
    { name: 'Angular', level: 90, color: '#dd0031' },
  ],
};
```

Los cambios se reflejan automaticamente en sidebar, navbar, perfil, footer y titulo de pagina.

### Colores

En `src/styles.scss` — variables CSS globales en `:root` (claro) y `body.dark-theme` (oscuro).

---

## Estructura rapida

```
src/
├── app/
│   ├── core/config/app-config.ts       <- Configuracion centralizada
│   ├── core/services/                  -> ThemeService, NotificationService
│   ├── core/guards/auth.guard.ts       -> Proteccion de rutas
│   ├── layouts/main-layout/            -> Sidebar + Navbar + Footer
│   ├── pages/                          -> 14 paginas (lazy loading)
│   └── shared/                         -> Sidebar, Navbar, Breadcrumb, dialogos
└── styles.scss                         -> Variables CSS globales
```

> Documentacion completa de componentes, servicios y guias: [`DOCUMENTACION.md`](./DOCUMENTACION.md)

---

## Stack

| Tecnologia | Version |
|---|---|
| Angular | 18 |
| Angular Material | 18 |
| Chart.js / ng2-charts | 4.5 / 6.0 |
| Tabler Icons | CDN |
| Plus Jakarta Sans | Google Fonts |

---

## Comandos utiles

| Comando | Para |
|---|---|
| `npm start` | Desarrollo con hot reload |
| `npm run build` | Build de produccion |
| `npm test` | Ejecutar tests |
| `ng generate component pages/mi-pagina` | Crear nueva pagina |

---

<div align="center">
  <p>Hecho con <3 por <strong>Josidk</strong></p>
  <p><em>Angular 18 · Angular Material · SCSS · Tabler Icons</em></p>
</div>
