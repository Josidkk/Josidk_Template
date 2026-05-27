# 🚀 Josidk ERP Template

> Una plantilla de dashboard administrativo moderna, lista para producción, construida con **Angular 18** y **Angular Material**.

---

## 📋 Tabla de Contenidos

- [¿Qué es esta plantilla?](#-qué-es-esta-plantilla)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Cómo Correr el Proyecto](#-cómo-correr-el-proyecto)
- [Componentes Disponibles](#-componentes-disponibles)
  - [Sidebar (Menú Lateral)](#sidebar-menú-lateral)
  - [Navbar (Barra Superior)](#navbar-barra-superior)
  - [Breadcrumb (Migas de Pan)](#breadcrumb-migas-de-pan)
  - [DataTable (Tabla de Datos)](#datatable-tabla-de-datos)
  - [Badges (Etiquetas de Estado)](#badges-etiquetas-de-estado)
- [Sistema de Diseño (Tokens CSS)](#-sistema-de-diseño-tokens-css)
- [Modo Oscuro](#-modo-oscuro)
- [Routing (Cómo Agregar Páginas)](#-routing-cómo-agregar-páginas)
- [Buenas Prácticas Aplicadas](#-buenas-prácticas-aplicadas)

---

## 💡 ¿Qué es esta plantilla?

**Josidk ERP Template** es una base sólida para construir aplicaciones empresariales tipo ERP/Dashboard. Viene con los componentes más usados en sistemas administrativos ya configurados y estilizados, para que solo te preocupes por la **lógica de negocio**.

Incluye de forma nativa:
- ✅ Layout con sidebar colapsable + navbar
- ✅ Tabla de datos con búsqueda, ordenamiento y paginación
- ✅ Breadcrumb dinámico reutilizable
- ✅ Badges de estado (activo, pendiente, inactivo)
- ✅ Modo oscuro integrado
- ✅ Página de login
- ✅ Sistema de diseño con tokens CSS centralizados

---

## 🛠 Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| [Angular](https://angular.dev/) | **18** | Framework principal |
| [Angular Material](https://material.angular.io/) | **18** | Componentes UI (Table, Paginator, Sort) |
| [Angular CDK](https://material.angular.io/cdk) | **18** | Utilidades de accesibilidad |
| [SCSS](https://sass-lang.com/) | Última | Estilos con variables y nesting |
| [Tabler Icons](https://tabler.io/icons) | Última (CDN) | Iconografía (prefijo `ti ti-`) |
| [Google Fonts - Inter](https://fonts.google.com/specimen/Inter) | — | Tipografía principal |
| TypeScript | **5.5** | Tipado estático |

> **Arquitectura:** Componentes **Standalone** (sin `NgModule`), ideal para Angular 17+.

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── layouts/
│   │   └── main-layout/          # 🏗️ Layout principal (sidebar + navbar + contenido)
│   ├── pages/
│   │   ├── auth/
│   │   │   └── login/            # 🔐 Página de inicio de sesión
│   │   └── users/
│   │       └── user-list/        # 👥 Ejemplo: tabla de usuarios
│   └── shared/
│       ├── sidebar/              # 📌 Menú lateral colapsable
│       ├── navbar/               # 🔝 Barra de navegación superior
│       ├── breadcrumb/           # 🧭 Migas de pan dinámicas
│       └── footer/               # 🦶 Pie de página
├── styles.scss                   # 🎨 Tokens de diseño globales (variables CSS)
└── index.html                    # 📄 Entry point (fuentes e iconos se cargan aquí)
```

---

## ✅ Requisitos Previos

Antes de correr el proyecto, asegúrate de tener instalado:

1. **Node.js** (versión 18 o superior)
   - Verifica con: `node -v`
   - Descarga en: https://nodejs.org

2. **Angular CLI** (versión 18)
   ```bash
   npm install -g @angular/cli@18
   ```
   - Verifica con: `ng version`

---

## 🚀 Cómo Correr el Proyecto

### 1. Clona el repositorio
```bash
git clone <url-del-repositorio>
cd Josidk_Template
```

### 2. Instala las dependencias
```bash
npm install
```

### 3. Levanta el servidor de desarrollo
```bash
npm start
# o equivalentemente:
ng serve
```

### 4. Abre en el navegador
```
http://localhost:4200
```

> La app redirige automáticamente al login en `http://localhost:4200/login`. Luego de "ingresar", verás el dashboard con el sidebar y navbar completos.

### Otros comandos útiles

| Comando | Descripción |
|---|---|
| `npm start` | Servidor de desarrollo (hot reload) |
| `npm run build` | Compilar para producción |
| `npm test` | Ejecutar pruebas unitarias |
| `ng generate component pages/mi-pagina` | Generar un nuevo componente |

---

## 🧩 Componentes Disponibles

### Sidebar (Menú Lateral)

**Ubicación:** `src/app/shared/sidebar/`

El sidebar es un componente reutilizable que acepta una lista de secciones y ítems. Soporta:
- Ítems con o sin sub-menú (dropdown)
- Badges ("New", números, etc.)
- Estado activo por ítem
- Modo colapsado (solo iconos)

**Cómo personalizar el menú:**

Abre `sidebar.component.ts` y edita el array `menuSections`:

```typescript
// sidebar.component.ts
menuSections: MenuSection[] = [
  {
    title: 'MI SECCIÓN',       // Título del grupo (en mayúsculas)
    items: [
      {
        id: 'mi-item',          // ID único del ítem
        label: 'Mi Módulo',     // Texto visible
        icon: 'ti ti-home',     // Ícono de Tabler Icons
        route: '/mi-modulo',    // Ruta Angular (opcional)
        badge: 'Nuevo',         // Badge opcional (texto)
      },
      {
        id: 'con-hijos',
        label: 'Con Submenú',
        icon: 'ti ti-apps',
        children: [             // Sub-ítems (genera un dropdown)
          { id: 'hijo-1', label: 'Sub-página 1', icon: 'ti ti-point' },
          { id: 'hijo-2', label: 'Sub-página 2', icon: 'ti ti-point' },
        ]
      }
    ]
  }
];
```

**Cómo usar en el layout:**

El sidebar ya está integrado en `main-layout.component.html`. El botón del navbar controla su estado colapsado:

```html
<!-- main-layout.component.html -->
<div class="erp-container" [class.sidebar-collapsed]="isSidebarCollapsed">
  <app-sidebar [isCollapsed]="isSidebarCollapsed"></app-sidebar>

  <div class="main-layout">
    <app-navbar (toggleSidebar)="isSidebarCollapsed = !isSidebarCollapsed"></app-navbar>
    <main class="content">
      <router-outlet></router-outlet>
    </main>
  </div>
</div>
```

**Íconos disponibles:** Usa el prefijo `ti ti-` seguido del nombre del ícono desde https://tabler.io/icons. Ejemplos:
- `ti ti-home` → Casa
- `ti ti-users` → Usuarios
- `ti ti-chart-bar` → Gráfica de barras
- `ti ti-settings` → Engranaje / Configuración

---

### Navbar (Barra Superior)

**Ubicación:** `src/app/shared/navbar/`

La barra superior incluye:
- Botón para **colapsar/expandir** el sidebar
- Buscador
- Navegación rápida por links
- Botón de **modo oscuro** ☀️/🌙
- Botón de idioma
- Notificaciones con badge
- Avatar de usuario

**API del componente (Output):**

```typescript
// Emite un evento cuando se hace click en el botón de menú
@Output() toggleSidebar = new EventEmitter<void>();
```

**Cómo extender los links del navbar:**

Edita `navbar.component.html` en la sección `nav-links`:

```html
<nav class="nav-links">
  <a class="nav-link" routerLink="/mi-ruta">Mi Módulo</a>
  <a class="nav-link" routerLink="/otro">Otro</a>
</nav>
```

---

### Breadcrumb (Migas de Pan)

**Ubicación:** `src/app/shared/breadcrumb/`

Componente reutilizable que muestra el título de la página, la ruta de navegación y un botón de acción opcional.

**API del componente (Inputs):**

| Input | Tipo | Requerido | Descripción |
|---|---|---|---|
| `pageTitle` | `string` | ✅ Sí | Título principal de la página |
| `icon` | `string` | ✅ Sí | Clase del ícono Tabler (ej: `'ti ti-users'`) |
| `breadcrumbs` | `BreadcrumbItem[]` | ✅ Sí | Array con la ruta de navegación |
| `actionButtonText` | `string` | ❌ No | Texto del botón de acción derecho |
| `actionButtonIcon` | `string` | ❌ No | Ícono del botón de acción |

**Cómo usar en tu página:**

```typescript
// mi-pagina.component.ts
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb.component';

breadcrumbs: BreadcrumbItem[] = [
  { label: 'Inicio', route: '/' },     // Se muestra como ícono de casa
  { label: 'Apps', route: '/apps' },   // Link clicable
  { label: 'Mi Página' }              // Último ítem = página actual (sin route)
];
```

```html
<!-- mi-pagina.component.html -->
<app-breadcrumb
  [pageTitle]="'Título de Mi Página'"
  [icon]="'ti ti-settings'"
  [breadcrumbs]="breadcrumbs"
  [actionButtonText]="'Exportar'"
  [actionButtonIcon]="'ti ti-download'">
</app-breadcrumb>
```

---

### DataTable (Tabla de Datos)

**Ubicación:** `src/app/pages/users/user-list/`

Implementado con **Angular Material Table** (`MatTableModule`). Incluye:
- 🔍 Búsqueda en tiempo real (filtra todas las columnas)
- ↕️ Ordenamiento por columna (click en el header)
- 📄 Paginación configurable
- ✏️ Botones de acción por fila

**Pasos para crear una nueva tabla:**

**1. Define tu interfaz de datos:**

```typescript
export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
}
```

**2. Importa los módulos de Material:**

```typescript
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule]
})
```

**3. Configura el componente:**

```typescript
export class ProductosComponent implements OnInit, AfterViewInit {
  displayedColumns = ['nombre', 'precio', 'categoria', 'acciones'];
  dataSource = new MatTableDataSource<Producto>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  productos: Producto[] = [
    { id: '1', nombre: 'Laptop', precio: 1500, categoria: 'Electrónica', stock: 10 },
    // ... más datos
  ];

  ngOnInit() {
    this.dataSource.data = this.productos;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }
}
```

**4. Plantilla HTML de la tabla:**

```html
<!-- Buscador -->
<input type="text" placeholder="Buscar..." (keyup)="applyFilter($event)">

<!-- Tabla -->
<table mat-table [dataSource]="dataSource" matSort class="erp-mat-table">

  <!-- Columna Nombre -->
  <ng-container matColumnDef="nombre">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
    <td mat-cell *matCellDef="let item">{{ item.nombre }}</td>
  </ng-container>

  <!-- Columna Precio -->
  <ng-container matColumnDef="precio">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Precio</th>
    <td mat-cell *matCellDef="let item">{{ item.precio | currency }}</td>
  </ng-container>

  <!-- Filas -->
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

  <!-- Sin resultados -->
  <tr class="mat-row empty-row" *matNoDataRow>
    <td class="mat-cell" colspan="4">Sin resultados</td>
  </tr>
</table>

<!-- Paginador -->
<mat-paginator [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons class="erp-mat-paginator">
</mat-paginator>
```

> 💡 Las clases `erp-mat-table` y `erp-mat-paginator` ya están definidas en el SCSS del componente `user-list` para que el estilo coincida con el tema de la plantilla.

---

### Badges (Etiquetas de Estado)

Los badges son clases CSS puras que puedes aplicar en cualquier `<span>`.

#### Badges de Estado (Status Badges)

Usados en la tabla de usuarios para mostrar estados:

```html
<!-- En el HTML -->
<span class="status-badge active">Active</span>
<span class="status-badge pending">Pending</span>
<span class="status-badge inactive">Inactive</span>
```

| Clase | Color | Uso recomendado |
|---|---|---|
| `status-badge active` | 🟢 Verde | Usuario/registro activo |
| `status-badge pending` | 🟡 Amarillo | En espera / pendiente |
| `status-badge inactive` | 🔴 Rojo suave | Desactivado / inactivo |

#### Badges de Rol (Role Badges)

Para mostrar el rol de un usuario:

```html
<span class="role-badge">Admin</span>
<span class="role-badge">Editor</span>
<span class="role-badge">Viewer</span>
```

#### Badges en el Sidebar

Para agregar un badge a un ítem del menú lateral, agrega la propiedad `badge` al ítem:

```typescript
{ id: 'nuevo-modulo', label: 'Mi Módulo', icon: 'ti ti-star', badge: 'New' }
{ id: 'alertas', label: 'Alertas', icon: 'ti ti-bell', badge: '5' }
```

---

## 🎨 Sistema de Diseño (Tokens CSS)

Todas las variables de diseño están centralizadas en `src/styles.scss`. Modifica este archivo para cambiar el tema visual de **toda la aplicación** de una sola vez.

```scss
/* src/styles.scss */
:root {
  /* ── Sidebar ── */
  --sidebar-width: 270px;               /* Ancho del sidebar expandido */
  --sidebar-collapsed-width: 80px;      /* Ancho del sidebar colapsado */
  --sidebar-bg-start: #1a3a5c;          /* Color inicial del gradiente */
  --sidebar-bg-end: #0f2744;            /* Color final del gradiente */

  /* ── Navbar ── */
  --navbar-height: 64px;

  /* ── Layout ── */
  --main-bg: #eef5fc;                   /* Fondo general de la app */
  --content-bg: #ffffff;                /* Fondo de las tarjetas */

  /* ── Colores Principales ── */
  --primary: #5d87ff;                   /* Color primario (botones, links activos) */
  --success: #13deb9;                   /* Verde éxito */
  --warning: #ffae1f;                   /* Amarillo advertencia */
  --danger: #fa896b;                    /* Rojo peligro */

  /* ── Tipografía ── */
  --text-primary: #2a3547;              /* Texto principal */
  --text-secondary: #5a6a85;            /* Texto secundario / subtítulos */

  /* ── Velocidad de animaciones ── */
  --transition-speed: 0.3s;
}
```

### Ejemplo: Cambiar el color primario

Para cambiar el color de acento de toda la app a un morado, simplemente edita:

```scss
:root {
  --primary: #7c3aed;
  --primary-light: #ede9fe;
}
```

---

## 🌙 Modo Oscuro

El modo oscuro está implementado con una clase CSS en el `<body>`. El botón de luna/sol en la navbar lo activa y desactiva automáticamente.

**Cómo funciona:**

```typescript
// navbar.component.ts
toggleDarkMode(): void {
  this.isDarkMode = !this.isDarkMode;
  document.body.classList.toggle('dark-theme', this.isDarkMode);
}
```

**Cómo agregar soporte de modo oscuro a tus estilos:**

```scss
// En el styles.scss, los tokens del dark theme sobreescriben los del light:
body.dark-theme {
  --main-bg: #111c2d;
  --content-bg: #1a2a40;
  --text-primary: #e6e8ec;
}

// En tu componente, usa siempre las variables CSS:
.mi-componente {
  background-color: var(--content-bg);  // ✅ Cambia automáticamente con el tema
  color: var(--text-primary);           // ✅ Cambia automáticamente
  background-color: #ffffff;            // ❌ Hardcodeado, no responde al tema oscuro
}
```

---

## 🗺 Routing (Cómo Agregar Páginas)

Las rutas están en `src/app/app.routes.ts`. El `MainLayoutComponent` actúa como contenedor padre: todo lo que se defina como hijo aparecerá dentro del layout con sidebar y navbar.

**Pasos para agregar una nueva página:**

**1. Genera el componente:**
```bash
ng generate component pages/productos/product-list
```

**2. Regístralo en las rutas:**

```typescript
// app.routes.ts
import { ProductListComponent } from './pages/productos/product-list/product-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'users', component: UserListComponent },
      { path: 'productos', component: ProductListComponent },  // ← Agrega aquí
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
```

**3. Agrega el ítem al sidebar:**

```typescript
// sidebar.component.ts — dentro de menuSections
{ id: 'productos', label: 'Productos', icon: 'ti ti-package', route: '/productos' }
```

---

## ✨ Buenas Prácticas Aplicadas

Esta plantilla fue construida siguiendo las siguientes convenciones para que sea fácil de mantener y escalar:

| Práctica | Implementación |
|---|---|
| **Componentes Standalone** | Sin `NgModule`, imports directos en cada componente |
| **Interfaces TypeScript** | `User`, `MenuItem`, `BreadcrumbItem` — tipos explícitos en todo |
| **CSS Variables (Tokens)** | Todo el diseño en variables, sin colores hardcodeados |
| **Separación de responsabilidades** | Layout / Pages / Shared bien separados |
| **Lazy Loading ready** | Estructura de rutas lista para implementar lazy loading |
| **OnInit y AfterViewInit** | Ciclos de vida correctos para inicializar datos y ViewChild |
| **Comentarios en código** | Los archivos `.ts` incluyen comentarios explicativos |
| **Sin lógica en templates** | La lógica compleja va en el `.ts`, no en el HTML |

---

## 📌 Próximos Pasos Sugeridos

- [ ] Conectar a una API real reemplazando los datos mock en `user-list.component.ts`
- [ ] Agregar un `AuthGuard` para proteger las rutas del layout principal
- [ ] Implementar un `ThemeService` para persistir el modo oscuro en `localStorage`
- [ ] Agregar más páginas dentro del `MainLayoutComponent`

---

<div align="center">
  <p>Hecho con ❤️ por <strong>Josidk</strong></p>
  <p><em>Angular 18 · Angular Material · SCSS · Tabler Icons</em></p>
</div>
