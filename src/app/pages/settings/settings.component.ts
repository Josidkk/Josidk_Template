import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';
import { NotificationService } from '../../core/services/notification.service';
import { ThemeService } from '../../core/services/theme.service';
import { SidebarConfigService } from '../../core/services/sidebar-config.service';
import { CustomColorDialogComponent, CustomColorData } from '../../shared/custom-color-dialog/custom-color-dialog.component';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PROJECT_FILES, ProjectFile } from './project-sources';

/* ─── Interfaces ─── */

interface ColorPalette {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  variables: Record<string, string>;
  darkVariables: Record<string, string>;
  custom?: boolean;
}

interface AppModule {
  id: string;
  name: string;
  icon: string;
  description: string;
  route: string;
  dependency?: string;
  folderPath?: string;
  routesToRemove?: string[];
  /** Si es true, el módulo no se puede deseleccionar */
  alwaysEnabled?: boolean;
}

/* ─── Component ─── */

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  private notify = inject(NotificationService);
  private theme = inject(ThemeService);
  private dialog = inject(MatDialog);
  private sidebarConfig = inject(SidebarConfigService);

  constructor() {
    const savedCustom = localStorage.getItem('josidk-custom-palette');
    if (savedCustom) {
      try {
        const result = JSON.parse(savedCustom);
        const idx = this.paletas.findIndex(p => p.id === 'personalizada');
        if (idx !== -1) {
          this.paletas[idx] = {
            ...this.paletas[idx],
            variables: result.variables,
            darkVariables: result.darkVariables,
          };
        }
      } catch (e) {}
    }

    const savedId = localStorage.getItem('josidk-active-palette');
    if (savedId) {
      this.selectedPaletteId.set(savedId);
      // Wait a tick before applying to ensure DOM is ready if it's first load
      setTimeout(() => {
        const palette = this.paletas.find(p => p.id === savedId);
        if (palette) {
          this.applyPalette(palette);
        }
      }, 0);
    }
  }

  readonly isDark = this.theme.isDark;

  /* ── Breadcrumb ── */
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Configuración' },
  ];

  /* ================================================================
     1. PALETAS DE COLOR
     ================================================================ */

  paletas: ColorPalette[] = [
    {
      id: 'tierra',
      name: 'Tierra',
      description: 'Tonos neutros y cálidos — el tema por defecto',
      previewColor: '#1A1208',
      variables: {
        '--primary': '#1A1208',
        '--primary-light': '#F0EDE6',
        '--accent-warm': '#C8B896',
        '--accent-warm-dark': '#9A8560',
        '--sidebar-bg': '#0F0F0E',
        '--sidebar-text-active': '#E9E3D6',
        '--sidebar-active-bar': '#C8B896',
        '--sidebar-active-bg': 'rgba(233, 227, 214, 0.10)',
        '--main-bg': '#F4F2ED',
        '--content-bg': '#FDFAF5',
        '--card-bg': '#FDFAF5',
        '--card-border': 'rgba(0,0,0,0.09)',
        '--navbar-bg': '#FDFAF5',
        '--navbar-border': 'rgba(0,0,0,0.07)',
        '--text-primary': '#1A1208',
        '--text-secondary': '#5C5348',
      },
      darkVariables: {
        '--primary': '#D4A853',
        '--primary-light': 'rgba(212, 168, 83, 0.12)',
        '--accent-warm': '#C8B896',
        '--accent-warm-dark': '#9A8560',
        '--sidebar-bg': '#0F0F0E',
        '--sidebar-text-active': '#E9E3D6',
        '--sidebar-active-bar': '#D4A853',
        '--sidebar-active-bg': 'rgba(212, 168, 83, 0.18)',
        '--main-bg': '#0C0C0B',
        '--content-bg': '#161614',
        '--card-bg': '#161614',
        '--card-border': 'rgba(212,168,83,0.08)',
        '--navbar-bg': '#161614',
        '--navbar-border': 'rgba(255,255,255,0.08)',
        '--text-primary': '#F0EDE6',
        '--text-secondary': 'rgba(240, 237, 230, 0.55)',
      },
    },
    {
      id: 'oceano',
      name: 'Océano',
      description: 'Azules profundos y frescos',
      previewColor: '#1E3A5F',
      variables: {
        '--primary': '#1E3A5F',
        '--primary-light': '#E8F0FE',
        '--accent-warm': '#7BA7D4',
        '--accent-warm-dark': '#4A7FA8',
        '--sidebar-bg': '#0D1B2A',
        '--sidebar-text-active': '#E0EFFE',
        '--sidebar-active-bar': '#7BA7D4',
        '--sidebar-active-bg': 'rgba(224, 239, 254, 0.10)',
        '--main-bg': '#F0F5FA',
        '--content-bg': '#FFFFFF',
        '--card-bg': '#FFFFFF',
        '--card-border': 'rgba(0,0,0,0.09)',
        '--navbar-bg': '#FFFFFF',
        '--navbar-border': 'rgba(0,0,0,0.07)',
        '--text-primary': '#1A2332',
        '--text-secondary': 'rgba(26, 35, 50, 0.70)',
      },
      darkVariables: {
        '--primary': '#7BA7D4',
        '--primary-light': 'rgba(123, 167, 212, 0.12)',
        '--accent-warm': '#7BA7D4',
        '--accent-warm-dark': '#5A8AB8',
        '--sidebar-bg': '#081220',
        '--sidebar-text-active': '#D6E8FA',
        '--sidebar-active-bar': '#7BA7D4',
        '--sidebar-active-bg': 'rgba(123, 167, 212, 0.18)',
        '--main-bg': '#0A111A',
        '--content-bg': '#111D2E',
        '--card-bg': '#111D2E',
        '--card-border': 'rgba(123,167,212,0.08)',
        '--navbar-bg': '#111D2E',
        '--navbar-border': 'rgba(255,255,255,0.08)',
        '--text-primary': '#E8F0FA',
        '--text-secondary': 'rgba(232, 240, 250, 0.55)',
      },
    },
    {
      id: 'bosque',
      name: 'Bosque',
      description: 'Verdes orgánicos y tierra',
      previewColor: '#2D5016',
      variables: {
        '--primary': '#2D5016',
        '--primary-light': '#EDF7E6',
        '--accent-warm': '#8FAA7B',
        '--accent-warm-dark': '#6B8A54',
        '--sidebar-bg': '#1A2E0F',
        '--sidebar-text-active': '#E2F0D8',
        '--sidebar-active-bar': '#8FAA7B',
        '--sidebar-active-bg': 'rgba(226, 240, 216, 0.10)',
        '--main-bg': '#F2F7EE',
        '--content-bg': '#FCFEFB',
        '--card-bg': '#FCFEFB',
        '--card-border': 'rgba(0,0,0,0.09)',
        '--navbar-bg': '#FCFEFB',
        '--navbar-border': 'rgba(0,0,0,0.07)',
        '--text-primary': '#1E2E14',
        '--text-secondary': 'rgba(30, 46, 20, 0.70)',
      },
      darkVariables: {
        '--primary': '#8FAA7B',
        '--primary-light': 'rgba(143, 170, 123, 0.12)',
        '--accent-warm': '#8FAA7B',
        '--accent-warm-dark': '#6B8A54',
        '--sidebar-bg': '#0F180C',
        '--sidebar-text-active': '#DCE8D0',
        '--sidebar-active-bar': '#8FAA7B',
        '--sidebar-active-bg': 'rgba(143, 170, 123, 0.18)',
        '--main-bg': '#0C1409',
        '--content-bg': '#162312',
        '--card-bg': '#162312',
        '--card-border': 'rgba(143,170,123,0.08)',
        '--navbar-bg': '#162312',
        '--navbar-border': 'rgba(255,255,255,0.08)',
        '--text-primary': '#E2F0D8',
        '--text-secondary': 'rgba(226, 240, 216, 0.55)',
      },
    },
    {
      id: 'purpura',
      name: 'Púrpura Real',
      description: 'Tonos violetas y elegantes',
      previewColor: '#5B2C8F',
      variables: {
        '--primary': '#5B2C8F',
        '--primary-light': '#F3ECFA',
        '--accent-warm': '#B794D6',
        '--accent-warm-dark': '#8E6BB5',
        '--sidebar-bg': '#1E1035',
        '--sidebar-text-active': '#E8DCF5',
        '--sidebar-active-bar': '#B794D6',
        '--sidebar-active-bg': 'rgba(232, 220, 245, 0.10)',
        '--main-bg': '#F5F0FA',
        '--content-bg': '#FEFCFF',
        '--card-bg': '#FEFCFF',
        '--card-border': 'rgba(0,0,0,0.09)',
        '--navbar-bg': '#FEFCFF',
        '--navbar-border': 'rgba(0,0,0,0.07)',
        '--text-primary': '#1E1433',
        '--text-secondary': 'rgba(30, 20, 51, 0.70)',
      },
      darkVariables: {
        '--primary': '#C9A2E8',
        '--primary-light': 'rgba(201, 162, 232, 0.12)',
        '--accent-warm': '#B794D6',
        '--accent-warm-dark': '#8E6BB5',
        '--sidebar-bg': '#150D22',
        '--sidebar-text-active': '#E8DCF5',
        '--sidebar-active-bar': '#C9A2E8',
        '--sidebar-active-bg': 'rgba(201, 162, 232, 0.18)',
        '--main-bg': '#0E0818',
        '--content-bg': '#1D1430',
        '--card-bg': '#1D1430',
        '--card-border': 'rgba(201,162,232,0.08)',
        '--navbar-bg': '#1D1430',
        '--navbar-border': 'rgba(255,255,255,0.08)',
        '--text-primary': '#EDE4F8',
        '--text-secondary': 'rgba(237, 228, 248, 0.55)',
      },
    },
    {
      id: 'atardecer',
      name: 'Atardecer',
      description: 'Naranjas y rojos cálidos',
      previewColor: '#C44536',
      variables: {
        '--primary': '#C44536',
        '--primary-light': '#FDF0ED',
        '--accent-warm': '#E8997A',
        '--accent-warm-dark': '#C87A5E',
        '--sidebar-bg': '#1F110D',
        '--sidebar-text-active': '#F5E0D8',
        '--sidebar-active-bar': '#E8997A',
        '--sidebar-active-bg': 'rgba(245, 224, 216, 0.10)',
        '--main-bg': '#FAF3F0',
        '--content-bg': '#FFFCFA',
        '--card-bg': '#FFFCFA',
        '--card-border': 'rgba(0,0,0,0.09)',
        '--navbar-bg': '#FFFCFA',
        '--navbar-border': 'rgba(0,0,0,0.07)',
        '--text-primary': '#2C1610',
        '--text-secondary': 'rgba(44, 22, 16, 0.70)',
      },
      darkVariables: {
        '--primary': '#E8997A',
        '--primary-light': 'rgba(232, 153, 122, 0.12)',
        '--accent-warm': '#E8997A',
        '--accent-warm-dark': '#C87A5E',
        '--sidebar-bg': '#1A0E0B',
        '--sidebar-text-active': '#F5E0D8',
        '--sidebar-active-bar': '#E8997A',
        '--sidebar-active-bg': 'rgba(232, 153, 122, 0.18)',
        '--main-bg': '#140A08',
        '--content-bg': '#241613',
        '--card-bg': '#241613',
        '--card-border': 'rgba(232,153,122,0.08)',
        '--navbar-bg': '#241613',
        '--navbar-border': 'rgba(255,255,255,0.08)',
        '--text-primary': '#F5E0D8',
        '--text-secondary': 'rgba(245, 224, 216, 0.55)',
      },
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Grises suaves y minimalistas',
      previewColor: '#2D2D2D',
      variables: {
        '--primary': '#2D2D2D',
        '--primary-light': '#F0F0F0',
        '--accent-warm': '#999999',
        '--accent-warm-dark': '#737373',
        '--sidebar-bg': '#1A1A1A',
        '--sidebar-text-active': '#E0E0E0',
        '--sidebar-active-bar': '#999999',
        '--sidebar-active-bg': 'rgba(224, 224, 224, 0.10)',
        '--main-bg': '#F5F5F5',
        '--content-bg': '#FFFFFF',
        '--card-bg': '#FFFFFF',
        '--card-border': 'rgba(0,0,0,0.09)',
        '--navbar-bg': '#FFFFFF',
        '--navbar-border': 'rgba(0,0,0,0.07)',
        '--text-primary': '#1A1A1A',
        '--text-secondary': 'rgba(0, 0, 0, 0.65)',
      },
      darkVariables: {
        '--primary': '#CCCCCC',
        '--primary-light': 'rgba(204, 204, 204, 0.10)',
        '--accent-warm': '#999999',
        '--accent-warm-dark': '#737373',
        '--sidebar-bg': '#0D0D0D',
        '--sidebar-text-active': '#E0E0E0',
        '--sidebar-active-bar': '#CCCCCC',
        '--sidebar-active-bg': 'rgba(204, 204, 204, 0.18)',
        '--main-bg': '#0D0D0D',
        '--content-bg': '#141414',
        '--card-bg': '#141414',
        '--card-border': 'rgba(204,204,204,0.08)',
        '--navbar-bg': '#141414',
        '--navbar-border': 'rgba(255,255,255,0.08)',
        '--text-primary': '#E0E0E0',
        '--text-secondary': 'rgba(224, 224, 224, 0.50)',
      },
    },
    /* ─── Personalizada ─── */
    {
      id: 'personalizada',
      name: 'Personalizada',
      description: 'Selecciona tus propios colores — abre el editor',
      previewColor: 'url(#gradient)',
      custom: true,
      variables: {
        '--primary': '#1A1208',
        '--primary-light': '#F0EDE6',
        '--accent-warm': '#C8B896',
        '--accent-warm-dark': '#9A8560',
        '--sidebar-bg': '#0F0F0E',
        '--sidebar-text-active': '#E9E3D6',
        '--sidebar-active-bar': '#C8B896',
        '--sidebar-active-bg': 'rgba(233, 227, 214, 0.10)',
        '--main-bg': '#F4F2ED',
        '--content-bg': '#FDFAF5',
        '--card-bg': '#FDFAF5',
        '--card-border': 'rgba(0,0,0,0.09)',
        '--navbar-bg': '#FDFAF5',
        '--navbar-border': 'rgba(0,0,0,0.07)',
        '--text-primary': '#1A1208',
        '--text-secondary': '#5C5348',
      },
      darkVariables: {
        '--primary': '#D4A853',
        '--primary-light': 'rgba(212, 168, 83, 0.12)',
        '--accent-warm': '#C8B896',
        '--accent-warm-dark': '#9A8560',
        '--sidebar-bg': '#0F0F0E',
        '--sidebar-text-active': '#E9E3D6',
        '--sidebar-active-bar': '#D4A853',
        '--sidebar-active-bg': 'rgba(212, 168, 83, 0.18)',
        '--main-bg': '#0C0C0B',
        '--content-bg': '#161614',
        '--card-bg': '#161614',
        '--card-border': 'rgba(212,168,83,0.08)',
        '--navbar-bg': '#161614',
        '--navbar-border': 'rgba(255,255,255,0.08)',
        '--text-primary': '#F0EDE6',
        '--text-secondary': 'rgba(240, 237, 230, 0.55)',
      },
    },
  ];

  private themeStyleId = 'josidk-palette-theme';

  selectedPaletteId = signal<string>('tierra');

  selectPalette(id: string): void {
    // Si es "personalizada", abrir el diálogo de color picker
    if (id === 'personalizada') {
      this.openColorEditor();
      return;
    }

    this.selectedPaletteId.set(id);
    localStorage.setItem('josidk-active-palette', id);
    const palette = this.paletas.find(p => p.id === id);
    if (palette) {
      this.applyPalette(palette);
      this.notify.info(`Tema "${palette.name}" aplicado`);
    }
  }

  private applyPalette(palette: ColorPalette): void {
    const existing = document.getElementById(this.themeStyleId);
    if (existing) existing.remove();

    const style = document.createElement('style');
    style.id = this.themeStyleId;

    const rootVars = Object.entries(palette.variables)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');

    const darkVars = Object.entries(palette.darkVariables)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');

    style.textContent = `:root {\n${rootVars}\n}\n\nbody.dark-theme {\n${darkVars}\n}`;
    document.head.appendChild(style);
  }

  /** Abre el diálogo de editor de colores personalizados. */
  private openColorEditor(): void {
    const currentPalette = this.paletas.find(p => p.id === 'personalizada')!;
    const previousId = this.selectedPaletteId();

    const dialogRef = this.dialog.open(CustomColorDialogComponent, {
      data: {
        variables: currentPalette.variables,
        darkVariables: currentPalette.darkVariables,
      } as CustomColorData,
      panelClass: 'glass-dialog-overlay',
      maxWidth: '90vw',
      width: '820px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: CustomColorData | null) => {
      if (result) {
        // Actualizar la paleta personalizada con los colores elegidos
        const idx = this.paletas.findIndex(p => p.id === 'personalizada');
        if (idx !== -1) {
          this.paletas[idx] = {
            ...this.paletas[idx],
            variables: result.variables,
            darkVariables: result.darkVariables,
          };
        }
        this.selectedPaletteId.set('personalizada');
        localStorage.setItem('josidk-active-palette', 'personalizada');
        localStorage.setItem('josidk-custom-palette', JSON.stringify(result));
        this.applyPalette({
          id: 'personalizada',
          name: 'Personalizada',
          description: 'Tus colores personalizados',
          previewColor: result.variables['--primary'],
          variables: result.variables,
          darkVariables: result.darkVariables,
          custom: true,
        });
        this.notify.success('Colores personalizados aplicados');
      } else {
        // Canceló — restaurar la paleta anterior
        this.selectPalette(previousId);
      }
    });
  }

  /* ================================================================
     2. MODULOS / PAGINAS
     ================================================================ */

  availableModules: AppModule[] = [
    { id: 'dashboard', name: 'Dashboard', icon: 'ti ti-chart-bar', description: 'Panel analitico con graficas y metricas', route: '/dashboard', dependency: 'chart.js' },
    { id: 'ecommerce', name: 'eCommerce', icon: 'ti ti-shopping-bag', description: 'Catalogo de productos y estadisticas de ventas', route: '/ecommerce' },
    { id: 'kanban', name: 'Kanban', icon: 'ti ti-layout-kanban', description: 'Tablero de tareas con drag & drop', route: '/kanban' },
    { id: 'chat', name: 'Chat', icon: 'ti ti-message-2', description: 'Bandeja de mensajes simulada', route: '/chat' },
    { id: 'calendar', name: 'Calendario', icon: 'ti ti-calendar', description: 'Vista de calendario mensual', route: '/calendar' },
    { id: 'email', name: 'Email', icon: 'ti ti-mail', description: 'Cliente de correo simulado', route: '/email' },
    { id: 'profile', name: 'Perfil', icon: 'ti ti-user-circle', description: 'Pagina de perfil de usuario editable', route: '/profile' },
    { id: 'users', name: 'Usuarios', icon: 'ti ti-users', description: 'Tabla de usuarios con busqueda y paginacion', route: '/users' },
    { id: 'ui-components', name: 'UI Components', icon: 'ti ti-palette', description: 'Demostracion de componentes reutilizables', route: '/ui-components' },
    { id: 'material-ui-section', name: 'Material UI', icon: 'ti ti-components', description: 'Seccion completa: botones, graficas, tabs, inputs', route: '/material/buttons', folderPath: 'material', routesToRemove: ['material/buttons', 'material/data', 'material/feedback', 'material/inputs', 'material/navigation', 'material/charts', 'material'] },
    { id: 'login', name: 'Login', icon: 'ti ti-login', description: 'Página de inicio de sesión premium (siempre incluida)', route: '/login', folderPath: 'auth/login', alwaysEnabled: true },
    { id: 'register', name: 'Registro', icon: 'ti ti-user-plus', description: 'Página de registro premium', route: '/register', folderPath: 'auth/register' },
  ];

  /** Signal que refleja si la seccion Material UI es visible en el sidebar */
  materialUIVisible = signal(this.sidebarConfig.isSectionVisible('Material UI'));

  toggleMaterialUISection(): void {
    const next = !this.materialUIVisible();
    this.materialUIVisible.set(next);
    this.sidebarConfig.toggleSection('Material UI', next);
    if (next) {
      this.notify.success('Sección Material UI visible en el menú');
    } else {
      this.notify.info('Sección Material UI oculta del menú');
    }
  }

  selectedModules = signal<Set<string>>(new Set(this.availableModules.map(m => m.id)));

  toggleModule(id: string): void {
    // Login no se puede deseleccionar
    const mod = this.availableModules.find(m => m.id === id);
    if (mod?.alwaysEnabled) return;

    this.selectedModules.update(set => {
      const next = new Set(set);
      if (next.has(id)) {
        if (next.size <= 1) return set;
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  isModuleSelected(id: string): boolean {
    // Login siempre está seleccionado
    const mod = this.availableModules.find(m => m.id === id);
    if (mod?.alwaysEnabled) return true;
    return this.selectedModules().has(id);
  }

  /* ================================================================
     3. OPCIONES DE LAYOUT
     ================================================================ */

  layoutOptions = signal({
    sidebarWidth: 280,
    sidebarCollapsedWidth: 74,
    contentRadius: 12,
    transitionSpeed: 0.28,
    animationStyle: 'normal' as 'normal' | 'fast' | 'none',
  });

  layoutPresets = [
    { label: 'Clasico', sidebarWidth: 280, sidebarCollapsedWidth: 74, contentRadius: 12, transitionSpeed: 0.28, animationStyle: 'normal' as const },
    { label: 'Compacto', sidebarWidth: 230, sidebarCollapsedWidth: 64, contentRadius: 8, transitionSpeed: 0.18, animationStyle: 'fast' as const },
    { label: 'Espacioso', sidebarWidth: 320, sidebarCollapsedWidth: 80, contentRadius: 16, transitionSpeed: 0.35, animationStyle: 'normal' as const },
  ];

  fontOptions = [
    { value: "'Plus Jakarta Sans', sans-serif", label: 'Plus Jakarta Sans (actual)' },
    { value: "'Inter', sans-serif", label: 'Inter' },
    { value: "'Poppins', sans-serif", label: 'Poppins' },
    { value: "'Nunito', sans-serif", label: 'Nunito' },
    { value: "'Roboto', sans-serif", label: 'Roboto' },
  ];

  selectedFont = signal(this.fontOptions[0].value);

  applyLayoutPreset(preset: { label: string; sidebarWidth: number; sidebarCollapsedWidth: number; contentRadius: number; transitionSpeed: number; animationStyle: string }): void {
    const root = document.documentElement;
    this.layoutOptions.set({ ...preset } as any);
    root.style.setProperty('--sidebar-width', `${preset.sidebarWidth}px`);
    root.style.setProperty('--sidebar-collapsed-width', `${preset.sidebarCollapsedWidth}px`);
    root.style.setProperty('--content-radius', `${preset.contentRadius}px`);
    root.style.setProperty('--transition-speed', `${preset.transitionSpeed}s`);
    this.notify.info(`Layout "${preset.label}" aplicado`);
  }

  changeFont(fontValue: string): void {
    this.selectedFont.set(fontValue);
    document.documentElement.style.setProperty('--font-family', fontValue);
    this.notify.info('Tipografia actualizada');
  }

  /* ================================================================
     4. OPCION: MODO OSCURO POR DEFECTO
     ================================================================ */

  defaultThemeOptions = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' },
    { value: 'system', label: 'Seguir sistema' },
  ];

  defaultTheme = signal<'light' | 'dark' | 'system'>('light');

  setDefaultTheme(theme: string): void {
    if (theme === 'light' || theme === 'dark' || theme === 'system') {
      this.defaultTheme.set(theme);
    }
  }

  toggleTheme(): void {
    this.theme.toggle();
  }

  /* ================================================================
     5. DESCARGA DEL PROYECTO COMPLETO
     ================================================================ */

  downloading = signal(false);

  async downloadTemplate(): Promise<void> {
    try {
      this.downloading.set(true);

      const config = this.buildConfig();

      // 1. Clone all project files into a mutable map
      const files = new Map<string, { content: string; binary: boolean }>();
      PROJECT_FILES.forEach((file, path) => {
        files.set(path, { ...file });
      });

      // 2. Apply all transformations in-memory
      this.applyThemeColors(files, config);
      this.applyLayoutVariables(files, config);
      this.removeExcludedPages(files, config);
      this.cleanRoutes(files, config);
      this.cleanSidebar(files, config);
      this.applyDefaultTheme(files, config);
      this.cleanDependencies(files, config);
      this.cleanAppConfig(files, config);
      this.removeSettingsPage(files);
      this.removeEmbedArtifacts(files);

      // 3. Add config reference file
      files.set('josidk-config.json', {
        content: JSON.stringify(config, null, 2),
        binary: false,
      });

      // 4. Add README
      files.set('LEEME.md', {
        content: this.buildReadme(config),
        binary: false,
      });

      // 5. Build ZIP
      const zip = new JSZip();
      files.forEach((file, path) => {
        if (file.binary) {
          // Decode Base64 to binary
          const binaryStr = atob(file.content);
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          zip.file(path, bytes);
        } else {
          zip.file(path, file.content);
        }
      });

      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const sizeMB = (blob.size / (1024 * 1024)).toFixed(1);
      saveAs(blob, `josidk-template-${config.meta.date}.zip`);

      this.notify.success(
        'Proyecto descargado',
        `ZIP listo (${sizeMB} MB) con ${files.size} archivos y tu configuración aplicada`
      );
    } catch (err) {
      console.error('Error generating project ZIP:', err);
      this.notify.error('Error', 'No se pudo generar la descarga');
    } finally {
      this.downloading.set(false);
    }
  }

  // ─── Config Builder ───

  private buildConfig(): JosidkConfig {
    const selectedPages = this.availableModules
      .filter(m => this.isModuleSelected(m.id))
      .map(m => ({
        id: m.id,
        name: m.name,
        route: m.route,
      }));

    const palette = this.paletas.find(p => p.id === this.selectedPaletteId())!;

    return {
      meta: {
        date: new Date().toISOString().split('T')[0],
        version: '1.0.0',
      },
      theme: {
        palette: palette.id,
        colors: palette.variables,
        darkColors: palette.darkVariables,
        defaultDarkMode: this.defaultTheme(),
      },
      modules: {
        selected: selectedPages,
        excluded: this.availableModules
          .filter(m => !this.isModuleSelected(m.id))
          .map(m => ({
            id: m.id,
            folder: m.folderPath || m.id,
            routes: m.routesToRemove || [m.id]
          })),
      },
      layout: {
        ...this.layoutOptions(),
        font: this.selectedFont(),
      },
      dependencies: this.computeDependencies(),
    };
  }

  private computeDependencies(): Record<string, boolean> {
    const needsCharts = this.selectedModules().has('dashboard') ||
                        this.selectedModules().has('material-ui-section');
    return {
      'chart.js': needsCharts,
      'ng2-charts': needsCharts,
    };
  }

  // ─── In-Memory Transformations ───

  /** Replace CSS variables in styles.scss with the selected palette colors */
  private applyThemeColors(
    files: Map<string, { content: string; binary: boolean }>,
    config: JosidkConfig
  ): void {
    const stylesFile = files.get('src/styles.scss');
    if (!stylesFile) return;

    let styles = stylesFile.content;

    // Apply light theme colors (in :root block)
    for (const [varName, value] of Object.entries(config.theme.colors)) {
      styles = this.replaceCSSVar(styles, varName, value);
    }

    // Apply dark theme colors (in body.dark-theme block)
    const darkColors = config.theme.darkColors;
    const darkMatch = styles.match(/body\s*\.dark-theme\s*\{([^}]*)\}/);
    if (darkMatch && Object.keys(darkColors).length > 0) {
      let block = darkMatch[1];
      for (const [varName, value] of Object.entries(darkColors)) {
        const regex = new RegExp('(' + this.escapeRegex(varName) + ':\\s*)[^;]+(;)', 'g');
        block = block.replace(regex, '$1' + value + '$2');
      }
      styles = styles.replace(darkMatch[0], 'body.dark-theme {' + block + '}');
    }

    stylesFile.content = styles;
  }

  /** Apply layout CSS variables (sidebar width, radius, speed, font) */
  private applyLayoutVariables(
    files: Map<string, { content: string; binary: boolean }>,
    config: JosidkConfig
  ): void {
    const stylesFile = files.get('src/styles.scss');
    if (!stylesFile) return;

    let styles = stylesFile.content;

    const layoutVars: Record<string, string> = {
      '--sidebar-width': config.layout.sidebarWidth + 'px',
      '--sidebar-collapsed-width': config.layout.sidebarCollapsedWidth + 'px',
      '--content-radius': config.layout.contentRadius + 'px',
      '--transition-speed': config.layout.transitionSpeed + 's',
      '--font-family': config.layout.font,
    };

    for (const [varName, value] of Object.entries(layoutVars)) {
      styles = this.replaceCSSVar(styles, varName, value);
    }

    stylesFile.content = styles;
  }

  /** Remove all files belonging to excluded pages (login is never removed) */
  private removeExcludedPages(
    files: Map<string, { content: string; binary: boolean }>,
    config: JosidkConfig
  ): void {
    for (const excluded of config.modules.excluded) {
      // Login nunca se elimina
      if (excluded.id === 'login') continue;

      const folderPrefix = `src/app/pages/${excluded.folder}/`;
      const keysToDelete: string[] = [];

      files.forEach((_, path) => {
        if (path.startsWith(folderPrefix)) {
          keysToDelete.push(path);
        }
      });

      keysToDelete.forEach(key => files.delete(key));
    }
  }

  /** Rebuild app.routes.ts from scratch — only selected modules */
  private cleanRoutes(
    files: Map<string, { content: string; binary: boolean }>,
    config: JosidkConfig
  ): void {
    const routesFile = files.get('src/app/app.routes.ts');
    if (!routesFile) return;

    const selectedIds = new Set(config.modules.selected.map(m => m.id));
    // Login siempre está seleccionado (aunque el usuario lo intente deseleccionar)
    selectedIds.add('login');

    // Map: module ID → route definition
    const routeMap: Record<string, { path: string; importPath: string; component: string }> = {
      register: { path: 'register', importPath: './pages/auth/register/register.component', component: 'RegisterComponent' },
      dashboard: { path: 'dashboard', importPath: './pages/dashboard/dashboard.component', component: 'DashboardComponent' },
      users: { path: 'users', importPath: './pages/users/users.component', component: 'UsersComponent' },
      profile: { path: 'profile', importPath: './pages/profile/profile.component', component: 'ProfileComponent' },
      'ui-components': { path: 'ui-components', importPath: './pages/ui-components/ui-components.component', component: 'UiComponentsComponent' },
      kanban: { path: 'kanban', importPath: './pages/kanban/kanban.component', component: 'KanbanComponent' },
      calendar: { path: 'calendar', importPath: './pages/calendar/calendar.component', component: 'CalendarComponent' },
      email: { path: 'email', importPath: './pages/email/email.component', component: 'EmailComponent' },
      chat: { path: 'chat', importPath: './pages/chat/chat.component', component: 'ChatComponent' },
      ecommerce: { path: 'ecommerce', importPath: './pages/ecommerce/ecommerce.component', component: 'EcommerceComponent' },
    };

    const lines: string[] = [];

    lines.push("import { Routes } from '@angular/router';");
    lines.push("import { AuthGuard } from './core/guards/auth.guard';");
    lines.push('');
    lines.push('export const routes: Routes = [');

    // ── Login (siempre incluido) ──
    lines.push('  {');
    lines.push("    path: 'login',");
    lines.push('    loadComponent: () =>');
    lines.push("      import('./pages/auth/login/login.component').then(m => m.LoginComponent),");
    lines.push('  },');

    // ── Register (if selected) ──
    if (selectedIds.has('register')) {
      lines.push('  {');
      lines.push("    path: 'register',");
      lines.push('    loadComponent: () =>');
      lines.push("      import('./pages/auth/register/register.component').then(m => m.RegisterComponent),");
      lines.push('  },');
    }

    // ── Main layout with children ──
    lines.push('  {');
    lines.push("    path: '',");
    lines.push('    loadComponent: () =>');
    lines.push("      import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),");
    lines.push('    canActivate: [AuthGuard],');
    lines.push('    children: [');

    // Redirect: dashboard → any other protected page (skip auth pages)
    const authPages = new Set(['login', 'register']);
    const firstChild = config.modules.selected.find(m => !authPages.has(m.id));
    const firstRoute = firstChild ? firstChild.id : 'dashboard';
    lines.push('      {');
    lines.push("        path: '',");
    lines.push(`        redirectTo: '${firstRoute}',`);
    lines.push("        pathMatch: 'full',");
    lines.push('      },');

    // Selected module routes (login/register are top-level, not children)
    for (const [moduleId, rc] of Object.entries(routeMap)) {
      if (selectedIds.has(moduleId) && !authPages.has(moduleId)) {
        lines.push('      {');
        lines.push(`        path: '${rc.path}',`);
        lines.push('        loadComponent: () =>');
        lines.push(`          import('${rc.importPath}').then(m => m.${rc.component}),`);
        lines.push('      },');
      }
    }

    // Material UI routes (if section selected)
    if (selectedIds.has('material-ui-section')) {
      const matPaths = ['buttons', 'data', 'feedback', 'inputs', 'navigation', 'charts'];
      const matComps = ['Buttons', 'Data', 'Feedback', 'Inputs', 'Navigation', 'Charts'];
      for (let i = 0; i < matPaths.length; i++) {
        lines.push('      {');
        lines.push(`        path: 'material/${matPaths[i]}',`);
        lines.push('        loadComponent: () =>');
        lines.push(`          import('./pages/material/material-${matPaths[i]}.component').then(m => m.Material${matComps[i]}Component),`);
        lines.push('      },');
      }
      // Redirect /material → /material/buttons
      lines.push('      {');
      lines.push("        path: 'material',");
      lines.push("        redirectTo: 'material/buttons',");
      lines.push("        pathMatch: 'full',");
      lines.push('      },');
    }

    lines.push('    ],');
    lines.push('  },');

    // ── Not-found (always) ──
    lines.push('  {');
    lines.push("    path: '**',");
    lines.push('    loadComponent: () =>');
    lines.push("      import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),");
    lines.push('  },');
    lines.push('];');

    routesFile.content = lines.join('\n');
  }

  /** Rebuild sidebar menuSections from scratch — only selected modules */
  private cleanSidebar(
    files: Map<string, { content: string; binary: boolean }>,
    config: JosidkConfig
  ): void {
    const sidebarFile = files.get('src/app/shared/sidebar/sidebar.component.ts');
    if (!sidebarFile) return;

    const selectedIds = new Set(config.modules.selected.map(m => m.id));

    // Map: module ID → sidebar item
    const sidebarMap: Record<string, { section: string; id: string; label: string; icon: string; route: string; badge?: string }> = {
      dashboard: { section: 'Dashboards', id: 'dashboard', label: 'Analytics', icon: 'ti ti-chart-bar', route: '/dashboard' },
      ecommerce: { section: 'Dashboards', id: 'ecommerce', label: 'eCommerce', icon: 'ti ti-shopping-bag', route: '/ecommerce' },
      chat: { section: 'Apps', id: 'chat', label: 'Chat', icon: 'ti ti-message-2', route: '/chat' },
      calendar: { section: 'Apps', id: 'calendar', label: 'Calendario', icon: 'ti ti-calendar', route: '/calendar' },
      email: { section: 'Apps', id: 'email', label: 'Email', icon: 'ti ti-mail', route: '/email' },
      kanban: { section: 'Apps', id: 'kanban', label: 'Kanban', icon: 'ti ti-layout-kanban', route: '/kanban' },
      profile: { section: 'Apps', id: 'profile', label: 'Perfil', icon: 'ti ti-user-circle', route: '/profile', badge: 'new' },
      users: { section: 'Gestión', id: 'users', label: 'Empleados', icon: 'ti ti-users', route: '/users' },
      'ui-components': { section: 'Gestión', id: 'ui-components', label: 'UI Components', icon: 'ti ti-palette', route: '/ui-components' },
    };

    const materialItems = [
      { id: 'mat-buttons', label: 'Botones', icon: 'ti ti-components', route: '/material/buttons' },
      { id: 'mat-data', label: 'Visualización', icon: 'ti ti-credit-card', route: '/material/data' },
      { id: 'mat-feedback', label: 'Feedback', icon: 'ti ti-bell-ringing', route: '/material/feedback' },
      { id: 'mat-inputs', label: 'Inputs', icon: 'ti ti-toggle-left', route: '/material/inputs' },
      { id: 'mat-navigation', label: 'Navegación', icon: 'ti ti-navigation', route: '/material/navigation' },
      { id: 'mat-charts', label: 'Gráficas', icon: 'ti ti-chart-bar', route: '/material/charts' },
    ];

    // Group selected items by section
    const sectionOrder = ['Dashboards', 'Apps', 'Gestión', 'Material UI'];
    const sections = new Map<string, { id: string; label: string; icon: string; route: string; badge?: string }[]>();

    for (const [moduleId, def] of Object.entries(sidebarMap)) {
      if (selectedIds.has(moduleId)) {
        if (!sections.has(def.section)) sections.set(def.section, []);
        sections.get(def.section)!.push({ id: def.id, label: def.label, icon: def.icon, route: def.route, badge: def.badge });
      }
    }

    if (selectedIds.has('material-ui-section')) {
      sections.set('Material UI', materialItems);
    }

    // Generate TypeScript code for menuSections
    const sb: string[] = [];
    sb.push('  menuSections: MenuSection[] = [');
    for (const section of sectionOrder) {
      const items = sections.get(section);
      if (!items || items.length === 0) continue;

      sb.push('    {');
      sb.push(`      title: '${section}',`);
      sb.push('      items: [');
      for (const item of items) {
        const props = `id: '${item.id}', label: '${item.label}', icon: '${item.icon}', route: '${item.route}'`;
        if (item.badge) {
          sb.push(`        { ${props}, badge: '${item.badge}' },`);
        } else {
          sb.push(`        { ${props} },`);
        }
      }
      sb.push('      ]');
      sb.push('    },');
    }
    sb.push('  ];');

    // Replace the old menuSections block
    sidebarFile.content = sidebarFile.content.replace(
      /menuSections:\s*MenuSection\[\]\s*=\s*\[[\s\S]*?\];/,
      sb.join('\n')
    );
  }

  /** Modify ThemeService to start with the user's selected default theme */
  private applyDefaultTheme(
    files: Map<string, { content: string; binary: boolean }>,
    config: JosidkConfig
  ): void {
    const themeService = files.get('src/app/core/services/theme.service.ts');
    if (!themeService) return;

    const defaultMode = config.theme.defaultDarkMode; // 'light', 'dark', 'system'

    // Replace the default localStorage hydration logic
    const oldLogic = "const saved = localStorage.getItem('josidk-theme');\\s*if \\(saved === 'dark'\\) \\{";
    
    let newLogic = "const saved = localStorage.getItem('josidk-theme') || '" + defaultMode + "';\n";
    if (defaultMode === 'system') {
      newLogic += "      if (saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {";
    } else {
      newLogic += "      if (saved === 'dark') {";
    }

    themeService.content = themeService.content.replace(new RegExp(oldLogic, 'g'), newLogic);
  }

  /** Remove unneeded dependencies from package.json */
  private cleanDependencies(
    files: Map<string, { content: string; binary: boolean }>,
    config: JosidkConfig
  ): void {
    const pkgFile = files.get('package.json');
    if (!pkgFile) return;

    try {
      const pkg = JSON.parse(pkgFile.content);

      // Remove chart.js deps if dashboard not selected
      if (!config.dependencies['chart.js']) {
        delete pkg.dependencies?.['chart.js'];
        delete pkg.dependencies?.['ng2-charts'];
      }

      // Remove file-saver & jszip (only needed for this download feature)
      delete pkg.dependencies?.['file-saver'];
      delete pkg.dependencies?.['jszip'];
      delete pkg.devDependencies?.['@types/file-saver'];

      // Remove embed script hooks (no longer needed in downloaded project)
      delete pkg.scripts?.['embed'];
      delete pkg.scripts?.['prestart'];
      delete pkg.scripts?.['prebuild'];

      pkgFile.content = JSON.stringify(pkg, null, 2);
    } catch {
      // If JSON parsing fails, leave as-is
    }
  }

  /** Remove ng2-charts/chart.js imports from app.config.ts if charts not needed */
  private cleanAppConfig(
    files: Map<string, { content: string; binary: boolean }>,
    config: JosidkConfig
  ): void {
    const needsCharts = config.dependencies['chart.js'] && config.dependencies['ng2-charts'];
    if (needsCharts) return; // keep charts imports

    // Remove the import line and provideCharts provider from app.config.ts
    const appConfigFile = files.get('src/app/app.config.ts');
    if (!appConfigFile) return;

    let content = appConfigFile.content;

    // Remove: import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
    content = content.replace(
      /import\s*\{[^}]*provideCharts[^}]*\}\s*from\s*['"]ng2-charts['"];\n?/g,
      ''
    );

    // Remove: provideCharts(withDefaultRegisterables()),
    content = content.replace(
      /\s*provideCharts\(withDefaultRegisterables\(\)\),?\n?/g,
      ''
    );

    appConfigFile.content = content;
  }

  /** Remove the Settings page itself and related files from the download */
  private removeSettingsPage(
    files: Map<string, { content: string; binary: boolean }>
  ): void {
    const keysToDelete: string[] = [];
    files.forEach((_, path) => {
      if (
        path.startsWith('src/app/pages/settings/') ||
        path === 'scripts/embed-sources.mjs'
      ) {
        keysToDelete.push(path);
      }
    });
    keysToDelete.forEach(key => files.delete(key));
    // Note: settings route & sidebar item are already excluded
    // because cleanRoutes()/cleanSidebar() build from scratch
  }

  /** Remove embed artifacts (project-sources.ts, custom-color-dialog, apply-config.mjs) that are only for the configurator */
  private removeEmbedArtifacts(
    files: Map<string, { content: string; binary: boolean }>
  ): void {
    const keysToDelete: string[] = [];
    files.forEach((_, path) => {
      if (
        path.includes('project-sources.ts') ||
        path.startsWith('scripts/apply-config.mjs') ||
        path.startsWith('src/app/shared/custom-color-dialog/')
      ) {
        keysToDelete.push(path);
      }
    });
    keysToDelete.forEach(key => files.delete(key));
  }

  // ─── Helpers ───

  private replaceCSSVar(content: string, varName: string, newValue: string): string {
    const regex = new RegExp('(' + this.escapeRegex(varName) + ':\\s*)[^;]+(;)', 'g');
    return content.replace(regex, '$1' + newValue + '$2');
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ─── README Builder ───

  private buildReadme(config: JosidkConfig): string {
    const pages = config.modules.selected.map(m => `  - ${m.name} (\`${m.route}\`)`).join('\n');

    return `# Josidk Template — Tu Proyecto Personalizado

Generado el: ${config.meta.date}

> Este proyecto ya tiene tu configuración aplicada. Solo necesitas instalar dependencias y arrancar.

## Inicio rápido

\`\`\`bash
npm install
npm start
\`\`\`

## Resumen de tu configuración

### Tema
- Paleta: ${config.theme.palette}
- Modo oscuro por defecto: ${config.theme.defaultDarkMode}

### Páginas incluidas (${config.modules.selected.length}):
${pages}

### Layout
- Sidebar: ${config.layout.sidebarWidth}px expandido / ${config.layout.sidebarCollapsedWidth}px colapsado
- Fuente: ${config.layout.font}
- Radio bordes: ${config.layout.contentRadius}px
- Velocidad animación: ${config.layout.transitionSpeed}s

---

## Configuración guardada

El archivo \`josidk-config.json\` contiene un respaldo de tu configuración completa para referencia.

## Siguientes pasos

1. Ejecuta \`npm install\` para instalar dependencias
2. Ejecuta \`npm start\` para iniciar el servidor de desarrollo
3. Personaliza las páginas con tu lógica de negocio
4. Consulta \`DOCUMENTACION.md\` para guías detalladas
`;
  }
}

/* ─── Config Types ─── */

export interface JosidkConfig {
  meta: {
    date: string;
    version: string;
  };
  theme: {
    palette: string;
    colors: Record<string, string>;
    darkColors: Record<string, string>;
    defaultDarkMode: string;
  };
  modules: {
    selected: { id: string; name: string; route: string }[];
    excluded: { id: string; folder: string; routes: string[] }[];
  };
  layout: {
    sidebarWidth: number;
    sidebarCollapsedWidth: number;
    contentRadius: number;
    transitionSpeed: number;
    animationStyle: string;
    font: string;
  };
  dependencies: Record<string, boolean>;
}
