# 📖 Documentación Técnica — Josidk ERP Template

> **Versión:** 1.0.0  
> **Stack:** Angular 18 · Angular Material · Chart.js · Tabler Icons  
> **Propósito:** Plantilla de dashboard administrativo lista para personalizar

---

## Índice

1. [Filosofía de la Plantilla](#1-filosofía-de-la-plantilla)
2. [Arquitectura](#2-arquitectura)
3. [Estructura de Archivos](#3-estructura-de-archivos)
4. [Componentes Compartidos](#4-componentes-compartidos)
   - [Sidebar](#sidebar)
   - [Navbar](#navbar)
   - [Breadcrumb](#breadcrumb)
   - [Footer](#footer)
   - [ConfirmDialog](#confirmdialog)
   - [CustomSnackbar / NotificationService](#customsnackbar--notificationservice)
5. [Servicios Centrales](#5-servicios-centrales)
   - [ThemeService](#themeservice)
   - [NotificationService](#notificationservice-1)
   - [SidebarConfigService](#sidebarconfigservice)
   - [AuthGuard](#authguard)
6. [Páginas Demo](#6-páginas-demo)
7. [Sistema de Diseño](#7-sistema-de-diseño)
8. [Guía de Personalización](#8-guía-de-personalización)
9. [Agregar una Página Nueva](#9-agregar-una-página-nueva)
10. [Eliminar Páginas](#10-eliminar-páginas)
11. [Configurador (Settings)](#11-configurador-settings)
12. [Material UI](#12-material-ui)
13. [Migrar a Producción](#13-migrar-a-producción)
14. [FAQ / Solución de Problemas](#14-faq--solución-de-problemas)

---

## 1. Filosofía de la Plantilla

Esta plantilla está diseñada para ser **punto de partida**, no un producto final. Los principios que guían su diseño:

| Principio | Explicación |
|-----------|-------------|
| **🧩 Modular** | Cada página y componente es independiente. Puedes copiar solo lo que necesites. |
| **🎨 Tematizable** | Todos los colores son variables CSS. Cambia la paleta en un solo lugar. |
| **♻️ Reutilizable** | Los componentes compartidos tienen una API clara (inputs/outputs). |
| **🗑️ Descartable** | Cada página se puede activar/desactivar desde el Configurador sin tocar código. |
| **📱 Responsive** | El layout se adapta a móvil, tablet y escritorio. |

---

## 2. Arquitectura

```
┌─────────────────────────────────────────────────┐
│                  index.html                      │
│  (Tabler Icons CDN + Google Fonts)              │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│              main.ts (bootstrap)                 │
│  provideCharts() · provideRouter() · etc.       │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│              AppComponent                       │
│  <router-outlet>                                │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│           MainLayoutComponent                   │
│  ┌──────────┬────────────────────┐              │
│  │ Sidebar  │     Navbar         │              │
│  │          ├────────────────────┤              │
│  │          │  <router-outlet>   │              │
│  │          │  (página activa)   │              │
│  │          ├────────────────────┤              │
│  │          │     Footer         │              │
│  └──────────┴────────────────────┘              │
└─────────────────────────────────────────────────┘
```

### Lazy Loading

Todas las páginas cargan con **lazy loading** (`loadComponent`). Esto significa que el bundle inicial solo incluye el layout y los componentes compartidos. Cada página se descarga cuando el usuario navega a ella.

---

## 3. Estructura de Archivos

```
src/
├── app/
│   ├── core/                          # 🧠 Lógica central
│   │   ├── guards/
│   │   │   └── auth.guard.ts          # Protección de rutas (token en localStorage)
│   │   └── services/
│   │       ├── theme.service.ts       # Modo oscuro con signals
│   │       ├── notification.service.ts# Snackbars con diseño glassmorphism
│   │       ├── sidebar-config.service.ts  # Oculta/muestra secciones del menú
│   │       └── notification-new.service.ts # ⚠️ DUPLICADO — NO USAR
│   │
│   ├── layouts/
│   │   └── main-layout/               # 🏗️ Layout principal (sidebar + navbar + contenido)
│   │       ├── main-layout.component.ts
│   │       ├── main-layout.component.html
│   │       └── main-layout.component.scss
│   │
│   ├── pages/                         # 📄 Páginas demo (cada una en su carpeta)
│   │   ├── auth/login/                # 🔐 Login
│   │   ├── dashboard/                 # 📊 Dashboard con Chart.js
│   │   ├── users/user-list/           # 👥 Tabla con MatTable
│   │   ├── profile/                   # 👤 Perfil editable
│   │   ├── settings/                  # ⚙️ Configurador de la plantilla
│   │   ├── kanban/                    # 📋 Kanban con drag & drop
│   │   ├── chat/                      # 💬 Chat simulado
│   │   ├── calendar/                  # 📅 Calendario mensual
│   │   ├── email/                     # ✉️ Cliente de correo simulado
│   │   ├── ecommerce/                 # 🛒 Catálogo con CRUD de productos
│   │   ├── material/                  # 🎨 Componentes Angular Material
│   │   │   ├── material-buttons.component.ts
│   │   │   ├── material-data.component.ts
│   │   │   ├── material-feedback.component.ts
│   │   │   ├── material-inputs.component.ts
│   │   │   ├── material-navigation.component.ts
│   │   │   ├── material-others.component.ts
│   │   │   └── material-charts.component.ts
│   │   ├── ui-components/             # 🎨 Demos de componentes reutilizables
│   │   └── not-found/                 # 404
│   │
│   └── shared/                        # ♻️ Componentes reutilizables
│       ├── sidebar/                   # Menú lateral colapsable
│       ├── navbar/                    # Barra superior
│       ├── footer/                    # Pie de página
│       ├── breadcrumb/                # Migas de pan dinámicas
│       ├── confirm-dialog/            # Diálogo de confirmación (danger/warning/info)
│       └── custom-snackbar/           # Template del snackbar (usar via NotificationService)
│
├── styles.scss                        # 🎨 Tokens de diseño globales
└── index.html                         # Fuentes + Tabler Icons CDN
```

---

## 4. Componentes Compartidos

### Sidebar

**Ubicación:** `src/app/shared/sidebar/`  
**Selector:** `<app-sidebar>`

#### API

| Input | Tipo | Descripción |
|-------|------|-------------|
| `isCollapsed` | `boolean` | Estado colapsado (solo iconos) |

| Output | Tipo | Descripción |
|--------|------|-------------|
| `toggleCollapse` | `EventEmitter<void>` | Emite al hacer clic en el botón de colapsar |

#### Personalizar el menú

Edita el array `menuSections` en `sidebar.component.ts`:

```typescript
menuSections: MenuSection[] = [
  {
    title: 'Mi Sección',
    items: [
      { id: 'inicio', label: 'Inicio', icon: 'ti ti-home', route: '/inicio' },
      { id: 'clientes', label: 'Clientes', icon: 'ti ti-users', route: '/clientes', badge: 'New' },
    ]
  }
];
```

**Opciones de cada item:**

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `id` | `string` | Identificador único |
| `label` | `string` | Texto visible |
| `icon` | `string` | Clase de Tabler Icons (`ti ti-...`) |
| `route` | `string` (opcional) | Ruta Angular para navegar |
| `badge` | `string` (opcional) | Badge: `'new'`, `'dot'`, o texto como `'5'` |
| `children` | `MenuItem[]` (opcional) | Sub-ítems para dropdown |

#### Secciones colapsables

Cada sección del sidebar se puede expandir/colapsar haciendo clic en su título. El estado se resetea al recargar la página.

---

### Navbar

**Ubicación:** `src/app/shared/navbar/`  
**Selector:** `<app-navbar>`

#### API

| Output | Tipo | Descripción |
|--------|------|-------------|
| `toggleSidebar` | `EventEmitter<void>` | Emite al hacer clic en el menú hamburguesa |

#### Funcionalidad integrada

- Botón de **modo oscuro** (usando `ThemeService`)
- **Notificaciones** con badge
- **Perfil de usuario** con avatar
- **Buscador** (demo visual, no funcional)
- Enlaces de navegación rápida

#### Personalizar

Para ocultar el buscador, comenta la sección `.search-bar` en el HTML.

---

### Breadcrumb

**Ubicación:** `src/app/shared/breadcrumb/`  
**Selector:** `<app-breadcrumb>`

#### API

| Input | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `pageTitle` | `string` | ✅ | Título principal de la página |
| `icon` | `string` | ✅ | Clase del ícono (`ti ti-...`) |
| `breadcrumbs` | `BreadcrumbItem[]` | ✅ | Array con la ruta de navegación |
| `actionButtonText` | `string` | ❌ | Texto del botón de acción |
| `actionButtonIcon` | `string` | ❌ | Ícono del botón de acción |

```typescript
interface BreadcrumbItem {
  label: string;
  route?: string; // Si no tiene route, es la página actual
}
```

#### Ejemplo

```html
<app-breadcrumb
  [pageTitle]="'Usuarios'"
  [icon]="'ti ti-users'"
  [breadcrumbs]="[
    { label: 'Inicio', route: '/' },
    { label: 'Gestión', route: '/gestion' },
    { label: 'Usuarios' }
  ]"
  [actionButtonText]="'Exportar'"
  [actionButtonIcon]="'ti ti-download'">
</app-breadcrumb>
```

---

### Footer

**Ubicación:** `src/app/shared/footer/`  
**Selector:** `<app-footer>`

Footer simple con texto de copyright. Se muestra al final del contenido en todas las páginas del layout.

---

### ConfirmDialog

**Ubicación:** `src/app/shared/confirm-dialog/`  
**Selector:** (uso via `MatDialog.open()`)

#### Tipos soportados

| Tipo | Uso | Color |
|------|-----|-------|
| `'danger'` | Eliminar, acciones destructivas | Rojo |
| `'warning'` | Advertencias | Amarillo |
| `'info'` | Confirmaciones generales | Azul/neutro |

#### Ejemplo

```typescript
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/confirm-dialog/confirm-dialog.component';

const ref = this.dialog.open(ConfirmDialogComponent, {
  data: {
    title: 'Eliminar registro',
    message: '¿Estás seguro de eliminar este elemento?',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    type: 'danger',
  } as ConfirmDialogData,
  panelClass: 'glass-dialog-overlay',
});

ref.afterClosed().subscribe(result => {
  if (result) { /* Usuario confirmó */ }
});
```

#### API (ConfirmDialogData)

| Propiedad | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `title` | `string` | ✅ | Título del diálogo |
| `message` | `string` | ✅ | Mensaje de confirmación |
| `confirmText` | `string` | ❌ | Texto del botón confirmar (default: "Confirmar") |
| `cancelText` | `string` | ❌ | Texto del botón cancelar (default: "Cancelar") |
| `type` | `'danger' \| 'warning' \| 'info'` | ❌ | Estilo visual (default: `'info'`) |

---

### CustomSnackbar / NotificationService

No uses `CustomSnackbarComponent` directamente. Siempre usa `NotificationService`.

```typescript
import { NotificationService } from '../../core/services/notification.service';

constructor(private notify: NotificationService) {}

// Métodos disponibles:
this.notify.success('Título', 'Mensaje opcional');
this.notify.error('Error', 'Detalle del error');
this.notify.warning('Advertencia', 'Mensaje');
this.notify.info('Información', 'Mensaje');
this.notify.loading('Procesando...');
```

---

## 5. Servicios Centrales

### ThemeService

**Ubicación:** `src/app/core/services/theme.service.ts`

Controla el modo oscuro/claro con signals de Angular. Persiste en `localStorage`.

```typescript
import { ThemeService } from '../../core/services/theme.service';

constructor(private theme: ThemeService) {}

// Signal reactiva
readonly isDark = this.theme.isDark;

// Alternar tema
this.theme.toggle();
```

```html
<i class="ti" [ngClass]="isDark() ? 'ti-sun' : 'ti-moon'"></i>
```

### NotificationService

**Ubicación:** `src/app/core/services/notification.service.ts`

Servicio que envuelve `MatSnackBar` con diseño glassmorphism personalizado.

```typescript
this.notify.success('Guardado');           // Solo título
this.notify.success('Guardado', 'Perfil actualizado');  // Título + descripción
```

| Método | Color | Icono |
|--------|-------|-------|
| `success()` | Verde | ✅ |
| `error()` | Rojo | ❌ |
| `warning()` | Amarillo | ⚠️ |
| `info()` | Azul | ℹ️ |
| `loading()` | Neutro | ⏳ |

### SidebarConfigService

**Ubicación:** `src/app/core/services/sidebar-config.service.ts`

Controla qué secciones del sidebar son visibles. Persiste en `localStorage`.

```typescript
import { SidebarConfigService } from '../../core/services/sidebar-config.service';

constructor(private config: SidebarConfigService) {}

// Consultar
this.config.isSectionVisible('Material UI'); // → boolean

// Cambiar
this.config.toggleSection('Material UI', false); // Oculta
```

Normalmente no necesitas usar este servicio directamente — se controla desde la página de **Configuración**.

### AuthGuard

**Ubicación:** `src/app/core/guards/auth.guard.ts`

Protege las rutas del dashboard. Actualmente verifica si existe un token en `localStorage`.

**Para producción**, reemplaza la verificación:

```typescript
// auth.guard.ts — ANTES (demo):
const token = localStorage.getItem('josidk-token');

// auth.guard.ts — DESPUÉS (producción):
const token = await this.authService.isAuthenticated();
```

---

## 6. Páginas Demo

| Página | Ruta | ¿Qué hace? | ¿Reutilizable? |
|--------|------|------------|:--------------:|
| **Login** | `/login` | Formulario de inicio de sesión con validación y token dummy | ⚠️ Parcial |
| **Dashboard** | `/dashboard` | Gráficas (Chart.js), métricas, cards de resumen | ⚠️ Parcial |
| **eCommerce** | `/ecommerce` | Catálogo de productos con CRUD (crear, editar, eliminar) mediante diálogos | ⚠️ Parcial |
| **Usuarios** | `/users` | Tabla con MatTable, búsqueda, ordenamiento, paginación | ✅ Sí |
| **Perfil** | `/profile` | Formulario de perfil editable con foto y datos personales | ⚠️ Parcial |
| **Kanban** | `/kanban` | Tablero de tareas con drag & drop (CDK) | ❌ Demo |
| **Chat** | `/chat` | Mensajes simulados con interfaz de chat | ❌ Demo |
| **Email** | `/email` | Cliente de correo con bandeja de entrada simulada | ❌ Demo |
| **Calendario** | `/calendar` | Calendario mensual con eventos mock | ❌ Demo |
| **Configuración** | `/settings` | Configurador visual: paletas, módulos, layout, descarga | ✅ Sí |
| **UI Components** | `/ui-components` | Demos de ConfirmDialog y CustomSnackbar | ✅ Sí |
| **Material UI** | `/material/*` | 7 páginas con ejemplos de componentes Angular Material | ✅ Sí |
| **404** | cualquier otra | Página de error no encontrado | ✅ Sí |

### Para llevar a producción

Las páginas marcadas como **❌ Demo** tienen datos mock hardcodeados y lógica específica que no sirve directamente en producción. Úsalas como **inspiración visual** y construye tus propias versiones.

Las páginas **✅ Sí** tienen una API limpia y se pueden reutilizar directamente.

---

## 7. Sistema de Diseño

### Variables CSS

Todos los colores y medidas están centralizados en `src/styles.scss` como variables CSS.

```scss
:root {
  --primary: #1A1208;           // Color primario (botones, enlaces activos)
  --primary-light: #F0EDE6;     // Versión clara del primario (fondos)
  --accent-warm: #C8B896;       // Acento cálido
  --sidebar-bg: #0F0F0E;        // Fondo del sidebar
  --main-bg: #F4F2ED;           // Fondo general de la app
  --content-bg: #FDFAF5;        // Fondo de tarjetas y contenedores
  --text-primary: #1A1208;      // Color de texto principal
  --text-secondary: rgba(0,0,0,0.42);  // Texto secundario
  --success: #2A7A44;           // Verde éxito
  --danger: #A83828;            // Rojo error
  --sidebar-width: 280px;       // Ancho del sidebar expandido
  --sidebar-collapsed-width: 74px;  // Ancho del sidebar colapsado
  --transition-speed: 0.28s;    // Velocidad de animaciones
  --content-radius: 12px;       // Radio de bordes general
}
```

### Dark Mode

Se activa agregando la clase `dark-theme` al `<body>`. Todas las variables tienen su contraparte oscura:

```scss
body.dark-theme {
  --primary: #D4A853;
  --main-bg: #0C0C0B;
  --content-bg: #161614;
  --text-primary: #F0EDE6;
  --text-secondary: rgba(240, 237, 230, 0.55);
  // ...
}
```

### Paletas de Color

El Configurador (Settings) incluye **6 paletas predefinidas** + editor personalizado:

| Paleta | Descripción |
|--------|-------------|
| **Tierra** 🌍 | Tonos neutros y cálidos (default) |
| **Océano** 🌊 | Azules profundos |
| **Bosque** 🌲 | Verdes orgánicos |
| **Púrpura Real** 🟣 | Violetas elegantes |
| **Atardecer** 🌅 | Naranjas y rojos |
| **Minimal** ⚪ | Grises minimalistas |

### Reglas de diseño

| Regla | Razón |
|-------|-------|
| ❌ No `#fff` | Usar `#FDFAF5` (blanco cálido) |
| ❌ No `#000` | Usar `#1A1208` (casi negro) |
| ❌ No `box-shadow` | Usar `border` + `card-3d` para profundidad |
| ✅ Variables CSS | Siempre usar `var(--...)` en vez de valores fijos |
| ✅ `card-3d` | Clase global para efecto de tarjeta con bordes multi-capa |

---

## 8. Guía de Personalización

### Cambiar colores

**Opción 1 — Desde el Configurador (recomendado):**
1. Ve a **Configuración**
2. Selecciona una paleta de color
3. Los cambios se aplican en vivo

**Opción 2 — Editando CSS:**
1. Abre `src/styles.scss`
2. Modifica las variables en `:root` (light) y `body.dark-theme` (dark)

### Cambiar la fuente

1. Ve a **Configuración > Layout y Apariencia**
2. Selecciona una fuente del selector
3. O agrega tu propia fuente en `index.html` y en el array `fontOptions` del componente de configuración

### Cambiar el logo

1. Reemplaza `src/Josidk_Logo_W_.png` por tu logo
2. Ajusta el tamaño en `sidebar.component.scss` si es necesario (`.logo-img`)

### Cambiar el nombre del usuario

Edita el objeto `user` en `sidebar.component.ts`:

```typescript
user = {
  name: 'Tu Nombre',
  role: 'Tu Rol',
  initials: 'TN',
};
```

---

## 9. Agregar una Página Nueva

### Paso 1: Genera el componente

```bash
ng generate component pages/mi-modulo/mi-pagina
```

### Paso 2: Registra la ruta

En `src/app/app.routes.ts`:

```typescript
{
  path: 'mi-pagina',
  loadComponent: () =>
    import('./pages/mi-modulo/mi-pagina/mi-pagina.component').then(m => m.MiPaginaComponent),
},
```

### Paso 3: Agrega al sidebar

En `src/app/shared/sidebar/sidebar.component.ts`:

```typescript
{ id: 'mi-pagina', label: 'Mi Página', icon: 'ti ti-star', route: '/mi-pagina' }
```

### Paso 4: Registra en el Configurador

En `src/app/pages/settings/settings.component.ts`, agrega la página al array `availableModules`:

```typescript
{ id: 'mi-pagina', name: 'Mi Página', icon: 'ti ti-star', description: 'Descripción breve', route: '/mi-pagina' },
```

Esto permite a los usuarios activar/desactivar la página desde Settings.

### Paso 5: Usa los componentes compartidos

```html
<app-breadcrumb [pageTitle]="'Mi Página'" [icon]="'ti ti-star'" [breadcrumbs]="breadcrumbs"></app-breadcrumb>

<div class="card-3d">
  <!-- contenido -->
</div>
```

---

## 10. Eliminar Páginas

### Desde el Configurador (recomendado)

1. Ve a **Configuración > Módulos del Sistema**
2. Desmarca las páginas que no quieras
3. Descarga el package — el script `apply-config.mjs` eliminará automáticamente las páginas no seleccionadas

### Manualmente

**1. Borra la carpeta:**
```bash
rm -rf src/app/pages/mi-pagina/
```

**2. Quita la ruta** de `src/app/app.routes.ts`

**3. Quita el item del sidebar** en `sidebar.component.ts`

**4. Quita el módulo del configurador** en `settings.component.ts` (array `availableModules`)

**5. Verifica que compile:**
```bash
npm run build
```

---

## 11. Configurador (Settings)

La página de Configuración (`/settings`) es el centro de control de la plantilla.

### Secciones

| Sección | Descripción |
|---------|-------------|
| **Colores y Marca** | Selección de paletas de color (6 predefinidas + editor personalizado) |
| **Módulos del Sistema** | Activa/desactiva páginas. Las desactivadas se excluyen al descargar el package |
| **Material UI** | Toggle para ocultar/mostrar la sección completa del sidebar |
| **Layout y Apariencia** | Presets de layout, tipografía, tema por defecto, modo oscuro |
| **Descargar Package** | Genera un ZIP con `josidk-config.json` + `apply-config.mjs` para aplicar la configuración a una copia fresca del template |

### Cómo funciona la descarga

El botón "Descargar Package" genera:
- `josidk-config.json` — Configuración completa (paleta, módulos seleccionados, layout)
- `apply-config.mjs` — Script Node.js que aplica la configuración automáticamente (elimina páginas no seleccionadas, aplica colores, ajusta layout)
- `LEEME.md` — Instrucciones de uso

---

## 12. Material UI

7 páginas con ejemplos interactivos de componentes Angular Material:

| Página | Ruta | Componentes demostrados |
|--------|------|------------------------|
| **Botones** | `/material/buttons` | Basic, Raised, Stroked, Flat, Icon, Mini FAB, Extended FAB |
| **Visualización** | `/material/data` | MatCard, Chips (selectables), Badges (contador + alerta) |
| **Feedback** | `/material/feedback` | Progress Bar (determinada/indeterminada/buffer), Spinners |
| **Inputs** | `/material/inputs` | Slide Toggle, Slider (simple + rango) |
| **Navegación** | `/material/navigation` | Tabs (4 pestañas con iconos), Expansion Panel (simple + wizard), Tooltips |
| **Diálogos** | `/material/others` | ConfirmDialog (danger/warning/info), Dividers |
| **Gráficas** | `/material/charts` | Bar, Line, Pie, Doughnut, Radar, PolarArea (Chart.js) |

Todas las páginas:
- Usan `var(--...)` para colores — se adaptan al tema activo
- Soportan **dark mode** automáticamente
- Tienen breadcrumb con navegación (Inicio > Material UI > Página)
- Son **independientes** — puedes eliminar las que no necesites

---

## 13. Migrar a Producción

### Check-list

- [ ] **Autenticación real**: Reemplazar token dummy por JWT/API real en `auth.guard.ts`
- [ ] **Servicios con HTTP**: Los datos mock en cada página deben reemplazarse por llamadas a un backend
- [ ] **HttpInterceptor**: Agregar un interceptor que adjunte el token JWT automáticamente
- [ ] **Manejo de errores**: Agregar manejo global de errores HTTP (401 → login, 500 → toast)
- [ ] **Eliminar páginas demo**: Kanban, Chat, Email, Calendario son visuales — reemplázalos con tu lógica de negocio
- [ ] **Service Worker**: Agregar `@angular/pwa` para soporte offline
- [ ] **Linter**: Configurar ESLint con `@angular-eslint/schematics`
- [ ] **Pruebas**: Agregar tests unitarios para servicios y componentes clave
- [ ] **Seguridad**: Mover el token de `localStorage` a `httpOnly` cookies (requiere backend)
- [ ] **Dependencias no usadas**: Revisar `package.json` y eliminar librerías que no uses (`chart.js`, `ai`, `@ai-sdk/groq`, etc.)

### Bugs conocidos

| Issue | Estado |
|-------|--------|
| `notification-new.service.ts` duplicado con import roto | ⚠️ Eliminar manualmente |
| Login con token dummy sin verificación real | ⚠️ Reemplazar en producción |
| Transiciones del sidebar con micro-saltos en algunos navegadores | ⚠️ Menor |
| Build warnings por CSS > 6.14 kB en varios componentes | ⚠️ Aumentar budget en `angular.json` |

---

## 14. FAQ / Solución de Problemas

### ¿Por qué hay dos NotificationService?

- `notification.service.ts` — ✅ **Usa este.** Import correcto.
- `notification-new.service.ts` — ❌ **NO USAR.** Tiene un import `@shared/...` que no existe. Es un archivo duplicado que puedes eliminar.

### ¿Por qué las páginas demo no son reutilizables?

Fueron creadas como **demostraciones visuales** para mostrar el potencial de la plantilla. Tienen datos mock y lógica específica. Úsalas como inspiración y construye tus propias versiones.

### ¿Se puede usar esta plantilla para un proyecto real?

Sí, como **base visual y estructural**. Los componentes compartidos (sidebar, navbar, breadcrumb, etc.) y el sistema de diseño (variables CSS, paletas, dark mode) están listos para producción. Las páginas demo necesitan ser reemplazadas con tu lógica de negocio.

### ¿Cómo actualizar Angular?

```bash
ng update @angular/core@19 @angular/cli@19 @angular/material@19
```

### ¿Cómo reducir el tamaño del build?

1. Elimina páginas que no uses (desde Configuración o manualmente)
2. Desinstala dependencias no usadas: `npm uninstall chart.js ng2-charts` (si no usas Dashboard)
3. Aumenta el budget de CSS en `angular.json` si los warnings te molestan

---

<div align="center">
  <p><strong>Josidk ERP Template</strong> — Angular 18 · Angular Material · SCSS · Tabler Icons</p>
  <p><em>Documentación actualizada — Junio 2026</em></p>
</div>
