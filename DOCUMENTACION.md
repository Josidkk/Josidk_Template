# Documentacion — Josidk ERP Template

> **Stack:** Angular 18 · Angular Material · Chart.js · Tabler Icons
> **Version:** 1.0.0

---

## Indice

1. [Primeros pasos](#1-primeros-pasos)
2. [Personalizacion rapida](#2-personalizacion-rapida)
3. [Componentes compartidos (API)](#3-componentes-compartidos-api)
4. [Servicios centrales](#4-servicios-centrales)
5. [Agregar una pagina nueva](#5-agregar-una-pagina-nueva)
6. [Migrar a produccion](#6-migrar-a-produccion)
7. [FAQ](#7-faq)

---

## 1. Primeros pasos

```bash
npm install
npm start        # -> http://localhost:4200
```

La app inicia en `/login`. Usa cualquier email/contrasena para entrar (el auth guard solo verifica que exista un token en localStorage).

### Como esta organizada la app

```
main.ts -> AppComponent -> MainLayoutComponent
                             ├── Sidebar (menu colapsable)
                             ├── Navbar (modo oscuro, notificaciones, perfil)
                             ├── <router-outlet> (pagina activa)
                             └── Footer
```

Todas las paginas cargan con **lazy loading** — el bundle inicial solo contiene el layout y componentes compartidos.

---

## 2. Personalizacion rapida

### 2.1 Marca y usuario — `app-config.ts`

Edita `src/app/core/config/app-config.ts` y los cambios se reflejan automaticamente en:

| Componente | Que cambia |
|---|---|
| `sidebar` | Logo, nombre y rol del usuario |
| `navbar` | Nombre e iniciales del usuario |
| `profile` | Todos los datos del perfil y skills |
| `dashboard` | Saludo con el nombre del usuario |
| `footer` | Nombre del sitio |
| `app.component` | Titulo de la pestana del navegador |

### 2.2 Colores

**Opcion 1 — Configurador visual** (`/settings`):
Selecciona entre 6 paletas o crea la tuya propia con el editor de colores.

**Opcion 2 — CSS directo:**
Edita las variables en `src/styles.scss`. Hay dos bloques:

```scss
:root {                    /* -> Modo claro */
  --primary: #1A1208;
  --sidebar-bg: #0F0F0E;
  --main-bg: #F4F2ED;
}

body.dark-theme {          /* -> Modo oscuro */
  --primary: #D4A853;
  --sidebar-bg: #0F0F0E;
}
```

### 2.3 Modulos (paginas activas)

Desde **Configuracion** -> **Modulos del Sistema**:
- Activa/desactiva paginas individuales
- Login es obligatorio, Register opcional
- Material UI tiene su propio toggle

Cuando termines, **Descargar Proyecto** genera un ZIP con la configuracion aplicada. Solo necesitas `npm install && npm start`.

> **Reglas de diseno:** Usa siempre `var(--...)` en vez de colores fijos. No uses `#fff` ni `#000` (prefiere `#FDFAF5` y `#1A1208`). Para tarjetas, usa la clase global `card-3d` en vez de `box-shadow`.

### 2.4 Logo

Reemplaza `src/Josidk_Logo_W_.png` por tu logo y ajusta el tamano en `sidebar.component.scss`.

---

## 3. Componentes compartidos (API)

### Breadcrumb

```html
<app-breadcrumb
  [pageTitle]="'Usuarios'"
  [icon]="'ti ti-users'"
  [breadcrumbs]="[
    { label: 'Inicio', route: '/' },
    { label: 'Usuarios' }
  ]">
</app-breadcrumb>
```

| Input | Tipo | Descripcion |
|---|---|---|
| `pageTitle` | `string` | Titulo de la pagina |
| `icon` | `string` | Clase del icono (`ti ti-...`) |
| `breadcrumbs` | `BreadcrumbItem[]` | Ruta de navegacion |

```typescript
interface BreadcrumbItem {
  label: string;
  route?: string; // omitir para la pagina actual
}
```

### ConfirmDialog

```typescript
const ref = this.dialog.open(ConfirmDialogComponent, {
  data: {
    title: 'Eliminar registro',
    message: 'Estas seguro?',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    type: 'danger',   // 'danger' | 'warning' | 'info'
  } as ConfirmDialogData,
  panelClass: 'glass-dialog-overlay',
});

ref.afterClosed().subscribe(confirmed => {
  if (confirmed) { /* Usuario confirmo */ }
});
```

### InfoDialog

```typescript
this.dialog.open(InfoDialogComponent, {
  data: {
    title: 'Informacion',
    message: 'Operacion completada.',
    icon: 'ti ti-check',
    confirmText: 'Entendido',
  },
  panelClass: 'glass-dialog-overlay',
});
```

### ComposeEmailDialog / CalendarEventDialog

Dialogos para redactar emails y crear eventos. Se usan via `MatDialog.open()` — revisa los componentes de email y calendar como ejemplo de uso.

### NotificationService

No uses `CustomSnackbarComponent` directamente. Siempre usa el servicio:

```typescript
this.notify.success('Guardado', 'Perfil actualizado');
this.notify.error('Error', 'No se pudo conectar');
this.notify.warning('Cuidado', 'Campos incompletos');
this.notify.info('Info', 'Version 2.0 disponible');
this.notify.loading('Procesando...');
this.notify.neutral('Nota', 'Cambio aplicado');
```

---

## 4. Servicios centrales

### ThemeService — Modo oscuro

```typescript
readonly isDark = this.theme.isDark;  // Signal reactiva
this.theme.toggle();  // Alterna entre claro/oscuro
```

Persiste en `localStorage` como `josidk-theme`.

### NotificationService — Notificaciones

Inyecta `NotificationService` y usa los metodos `success`, `error`, `warning`, `info`, `loading`, `neutral`. Todos aceptan titulo + mensaje opcional.

### SidebarConfigService — Visibilidad de secciones

```typescript
this.config.isSectionVisible('Material UI');  // -> boolean
this.config.toggleSection('Material UI', false);  // Oculta
```

Persiste en `localStorage`. Se controla desde `/settings`.

### AuthGuard — Proteccion de rutas

```typescript
// En app.routes.ts
canActivate: [AuthGuard]
```

Verifica que exista `localStorage.getItem('josidk-token')`. **Para produccion**, reemplazalo con tu logica real (JWT, Firebase, etc.).

---

## 5. Agregar una pagina nueva

```bash
ng generate component pages/mi-modulo/mi-pagina
```

### 5.1 Registra la ruta

En `src/app/app.routes.ts` (dentro del `children` del layout principal):

```typescript
{
  path: 'mi-pagina',
  loadComponent: () =>
    import('./pages/mi-modulo/mi-pagina/mi-pagina.component').then(m => m.MiPaginaComponent),
},
```

### 5.2 Agrega al sidebar

En `src/app/shared/sidebar/sidebar.component.ts`, dentro de `menuSections`:

```typescript
{ id: 'mi-pagina', label: 'Mi Pagina', icon: 'ti ti-star', route: '/mi-pagina' }
```

### 5.3 Registra en el Configurador

En `settings.component.ts`, agrega al array `availableModules`:

```typescript
{ id: 'mi-pagina', name: 'Mi Pagina', icon: 'ti ti-star', description: 'Descripcion', route: '/mi-pagina' }
```

### 5.4 Usa el breadcrumb

```html
<app-breadcrumb
  [pageTitle]="'Mi Pagina'"
  [icon]="'ti ti-star'"
  [breadcrumbs]="[{ label: 'Inicio', route: '/' }, { label: 'Mi Pagina' }]">
</app-breadcrumb>

<div class="card-3d">
  <!-- Tu contenido aqui -->
</div>
```

---

## 6. Migrar a produccion

- [ ] **Autenticacion real** — Reemplazar token dummy por JWT/API en `auth.guard.ts`
- [ ] **Servicios HTTP** — Reemplazar datos mock por llamadas a un backend
- [ ] **Interceptor HTTP** — Adjuntar token JWT automaticamente en todas las peticiones
- [ ] **Manejo de errores** — 401 -> redirigir a login, 500 -> notificar usuario
- [ ] **Paginas demo** — Reemplazar Kanban, Chat, Email, Calendario con tu logica de negocio
- [ ] **PWA** — Agregar `@angular/pwa` para soporte offline
- [ ] **Pruebas** — Tests unitarios para servicios y componentes clave

---

## 7. FAQ

### Puedo usar esto para un proyecto real?

Si, como **base visual**. Los componentes compartidos (sidebar, navbar, breadcrumb) y el sistema de diseno (CSS variables, paletas, dark mode) estan listos para produccion. Las paginas demo deben reemplazarse con tu logica de negocio.

### Donde cambio el nombre del sitio y usuario?

En `src/app/core/config/app-config.ts`. Un solo archivo.

### Como actualizo Angular?

```bash
ng update @angular/core@19 @angular/cli@19 @angular/material@19
```

### Se puede reducir el tamano del build?

1. Desde **Configuracion**, desactiva paginas que no uses
2. Si no usas graficas, desactiva Dashboard y Material UI (ng2-charts no se incluira)
3. Aumenta el budget de CSS en `angular.json` si ves warnings:

```json
"budgets": [
  { "type": "anyComponentStyle", "maximumWarning": "10kB", "maximumError": "15kB" }
]
```

### Como funciona la descarga del proyecto?

El boton "Descargar Proyecto" en `/settings` genera un ZIP con:
- Todos los archivos del proyecto con tu configuracion aplicada (colores, paginas seleccionadas, layout)
- `josidk-config.json` — respaldo de la configuracion
- `LEEME.md` — instrucciones de uso

Solo necesitas `npm install && npm start`.

### Por que los datos de las paginas demo son ficticios?

Son demostraciones visuales del potencial de la plantilla. Usalas como inspiracion para construir tus propias versiones con datos reales.

---

<div align="center">
  <p><strong>Josidk ERP Template</strong> — Angular 18 · Angular Material · SCSS · Tabler Icons</p>
</div>
