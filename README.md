# 🚀 Josidk ERP Template

> **Angular 18** · **Angular Material** · **Chart.js** · **Tabler Icons**  
> Plantilla de dashboard administrativo moderna, modular y lista para personalizar.

---

## ⚡ Quick Start

```bash
git clone <url>
cd Josidk_Template
npm install
npm start          # → http://localhost:4200
```

> La app inicia en `/login`. Usa cualquier email/contraseña para entrar.

---

## ✨ Features

| | | |
|---|---|---|
| ✅ Layout completo | Sidebar colapsable + Navbar + Footer | Responsive (móvil/tablet/desktop) |
| ✅ 13 páginas demo | Dashboard, eCommerce, Kanban, Chat, Email, Calendario y más | Lazy loading |
| ✅ Angular Material | Botones, Tabs, Chips, Badges, Sliders, Expansion Panels y más | 7 páginas demo |
| ✅ Modo oscuro | Con persistencia en localStorage | Alterna desde el navbar |
| ✅ 6 paletas de color | Tierra, Océano, Bosque, Púrpura, Atardecer, Minimal | + editor personalizado |
| ✅ Configurador visual | Activa/desactiva módulos, cambia colores, descarga package | `/settings` |
| ✅ CRUD de productos | Diálogo con formulario para crear/editar/eliminar | eCommerce |
| ✅ Gráficas (Chart.js) | Bar, Line, Pie, Doughnut, Radar, PolarArea | Dashboard + Material |
| ✅ Componentes compartidos | Breadcrumb, ConfirmDialog, NotificationService, SidebarConfig | Reutilizables |
| ✅ CSS Variables | Tema centralizado en `styles.scss` | Fácil de personalizar |

---

## 📁 Estructura

```
src/
├── app/
│   ├── core/services/         → ThemeService, NotificationService, SidebarConfigService
│   ├── core/guards/           → AuthGuard (protección de rutas)
│   ├── layouts/main-layout/   → Layout con sidebar + navbar + router-outlet
│   ├── pages/                 → 13 páginas demo (lazy loading)
│   │   ├── auth/login/        → 🔐 Login
│   │   ├── dashboard/         → 📊 Dashboard con gráficas
│   │   ├── ecommerce/         → 🛒 Catálogo con CRUD
│   │   ├── users/             → 👥 Tabla con MatTable
│   │   ├── kanban/            → 📋 Kanban drag & drop
│   │   ├── chat/ + email/     → 💬✉️ Comunicación
│   │   ├── calendar/          → 📅 Calendario
│   │   ├── profile/           → 👤 Perfil
│   │   ├── settings/          → ⚙️ Configurador
│   │   ├── material/          → 🎨 7 páginas Material UI
│   │   └── ui-components/     → Demos de componentes compartidos
│   └── shared/                → Sidebar, Navbar, Breadcrumb, Footer, ConfirmDialog
├── styles.scss                → Variables CSS globales (colores, layout)
└── index.html                 → Fuentes + Tabler Icons CDN
```

---

## 🎨 Personalización Rápida

### 1. Colores

**Desde el Configurador** → `/settings` → selecciona una paleta de color.

**O editando** `src/styles.scss`:
```scss
:root {
  --primary: #1A1208;       // Color principal
  --sidebar-bg: #0F0F0E;   // Fondo del menú
  --main-bg: #F4F2ED;      // Fondo general
}
```

### 2. Módulos (páginas)

**Desde el Configurador** → `/settings` → Módulos del Sistema:
- Activa/desactiva páginas individuales
- La sección Material UI tiene su propio toggle
- Descarga un package con `apply-config.mjs` para aplicar los cambios

### 3. Componentes reutilizables

| Componente | Cómo usarlo |
|------------|-------------|
| **Breadcrumb** | `<app-breadcrumb [pageTitle]="'Título'" [icon]="'ti ti-star'" [breadcrumbs]="bc"></app-breadcrumb>` |
| **ConfirmDialog** | `this.dialog.open(ConfirmDialogComponent, { data: { title, message, type: 'danger' } })` |
| **Notification** | `this.notify.success('Título', 'Mensaje')` — inyecta `NotificationService` |
| **Card** | `<div class="card-3d">` — clase CSS global |
| **SidebarConfig** | Toggle "Material UI" en Settings — oculta/muestra la sección del menú |

### 4. Menú lateral

Edita `src/app/shared/sidebar/sidebar.component.ts`:
```typescript
menuSections: MenuSection[] = [
  {
    title: 'Mi Sección',
    items: [
      { id: 'pagina', label: 'Mi Página', icon: 'ti ti-star', route: '/mi-pagina' },
    ]
  }
];
```

---

## 🧩 Documentación Detallada

Para documentación completa de cada componente, servicios, API y guías de personalización:

👉 **[DOCUMENTACION.md](./DOCUMENTACION.md)**

Incluye:
- API de todos los componentes compartidos (inputs/outputs)
- Cómo agregar una página nueva (paso a paso)
- Cómo eliminar páginas
- Lista de verificación para migrar a producción
- FAQ y solución de problemas

---

## 🛠 Stack Tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Angular | 18 | Framework |
| Angular Material | 18 | Componentes UI |
| Chart.js + ng2-charts | 4.5 + 6.0 | Gráficas |
| Tabler Icons | CDN | Iconos |
| Plus Jakarta Sans | Google Fonts | Tipografía |
| TypeScript | 5.5 | Lenguaje |

---

## 📋 Comandos

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo (hot reload) |
| `npm run build` | Compilar para producción |
| `npm test` | Ejecutar pruebas |
| `ng generate component pages/mi-pagina` | Nueva página |

---

## ⚠️ Notas

- `notification-new.service.ts` es un **duplicado con import roto**. Usa siempre `notification.service.ts`.
- Las páginas Kanban, Chat, Email y Calendario son **demostraciones visuales** con datos mock. No son funcionales sin backend.
- Si no usas Dashboard, desinstala `chart.js` y `ng2-charts` para reducir el bundle.

---

<div align="center">
  <p>Hecho con ❤️ por <strong>Josidk</strong></p>
  <p><em>Angular 18 · Angular Material · SCSS · Tabler Icons</em></p>
</div>
