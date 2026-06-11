import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';
import { NotificationService } from '../../core/services/notification.service';
import { ThemeService } from '../../core/services/theme.service';
import { SidebarConfigService } from '../../core/services/sidebar-config.service';
import { CustomColorDialogComponent, CustomColorData } from '../../shared/custom-color-dialog/custom-color-dialog.component';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
        '--text-secondary': 'rgba(0, 0, 0, 0.42)',
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
        '--text-secondary': 'rgba(26, 35, 50, 0.45)',
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
        '--text-secondary': 'rgba(30, 46, 20, 0.45)',
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
        '--text-secondary': 'rgba(30, 20, 51, 0.45)',
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
        '--text-secondary': 'rgba(44, 22, 16, 0.45)',
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
        '--text-secondary': 'rgba(0, 0, 0, 0.40)',
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
        '--text-secondary': 'rgba(0, 0, 0, 0.42)',
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
    { id: 'login', name: 'Login', icon: 'ti ti-login', description: 'Página de inicio de sesión premium', route: '/login', folderPath: 'auth/login' },
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
     5. DESCARGA DEL PACKAGE
     ================================================================ */

  downloading = signal(false);

  async downloadTemplate(): Promise<void> {
    try {
      this.downloading.set(true);

      const zip = new JSZip();
      const config = this.buildConfig();

      zip.file('josidk-config.json', JSON.stringify(config, null, 2));

      const scriptContent = generateApplyScript(config);
      zip.file('apply-config.mjs', scriptContent);

      zip.file('LEEME.md', this.buildReadme(config));

      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
      saveAs(blob, `josidk-template-config-${config.meta.date}.zip`);

      this.notify.success('Package descargado', 'Incluye config JSON + script aplicador + instrucciones');
    } catch (err) {
      console.error(err);
      this.notify.error('Error', 'No se pudo generar la descarga');
    } finally {
      this.downloading.set(false);
    }
  }

  private buildConfig(): JosidkConfig {
    const selectedPages = this.availableModules
      .filter(m => this.selectedModules().has(m.id))
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
          .filter(m => !this.selectedModules().has(m.id))
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
    return {
      'chart.js': this.selectedModules().has('dashboard'),
      'ng2-charts': this.selectedModules().has('dashboard'),
    };
  }

  private buildReadme(config: JosidkConfig): string {
    const pages = config.modules.selected.map(m => `  - ${m.name} (\`${m.route}\`)`).join('\n');

    return `# Josidk Template - Configuracion Personalizada

Generado el: ${config.meta.date}

## Resumen de tu configuracion

### Tema
- Paleta: ${config.theme.palette}
- Modo oscuro por defecto: ${config.theme.defaultDarkMode}

### Paginas incluidas (${config.modules.selected.length}):
${pages}

### Layout
- Sidebar: ${config.layout.sidebarWidth}px expandido / ${config.layout.sidebarCollapsedWidth}px colapsado
- Fuente: ${config.layout.font}
- Radio bordes: ${config.layout.contentRadius}px
- Velocidad animacion: ${config.layout.transitionSpeed}s

---

## Como aplicar esta configuracion

### Opcion 1: Script automatico (recomendado)
Requiere Node.js 18+.

\`\`\`bash
git clone <url-del-template> mi-proyecto
cd mi-proyecto
# Copia josidk-config.json a la raiz
node apply-config.mjs
\`\`\`

### Opcion 2: Manual
1. Copia los colores del tema a src/styles.scss
2. Elimina las carpetas de paginas no deseadas en src/app/pages/
3. Actualiza src/app/app.routes.ts
4. Actualiza src/app/shared/sidebar/sidebar.component.ts
5. Actualiza package.json
6. Ejecuta npm install
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

/* ─── Script Generator ─── */

function generateApplyScript(config: JosidkConfig): string {
  const excluded = JSON.stringify(config.modules.excluded);
  const sidebarWidth = config.layout.sidebarWidth;
  const sidebarCollapsed = config.layout.sidebarCollapsedWidth;
  const contentRadius = config.layout.contentRadius;
  const transitionSpeed = config.layout.transitionSpeed;
  const font = config.layout.font.replace(/'/g, "\\'");

  const lines: string[] = [];
  const push = (s: string) => lines.push(s);

  push("// Josidk Template - apply-config.mjs");
  push("// Aplica automaticamente la configuracion descargada al proyecto base.");
  push("// Uso: node apply-config.mjs");
  push("");
  push("import { readFileSync, writeFileSync, existsSync, rmSync, readdirSync } from 'fs';");
  push("import { join, dirname } from 'path';");
  push("import { fileURLToPath } from 'url';");
  push("");
  push("const __dirname = dirname(fileURLToPath(import.meta.url));");
  push("const CONFIG_PATH = join(__dirname, 'josidk-config.json');");
  push("");
  push("if (!existsSync(CONFIG_PATH)) {");
  push("  console.error('No se encuentra josidk-config.json en el directorio actual.');");
  push("  process.exit(1);");
  push("}");
  push("");
  push("const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));");
  push("");
  push("// --- Helper ---");
  push("function replaceCSSVar(content, varName, newValue) {");
  push("  const regex = new RegExp('(' + varName + ':\\\\s*)[^;]+(;)', 'g');");
  push("  return content.replace(regex, '$1' + newValue + '$2');");
  push("}");
  push("");
  push("console.log('Aplicando configuracion de Josidk Template...\\n');");
  push("");
  push("// 1. Colores / Tema");
  push("console.log('Aplicando paleta de colores...');");
  push("const stylesPath = join(__dirname, 'src', 'styles.scss');");
  push("if (existsSync(stylesPath)) {");
  push("  let styles = readFileSync(stylesPath, 'utf-8');");
  push("  for (const [key, value] of Object.entries(config.theme.colors || {})) {");
  push("    styles = replaceCSSVar(styles, key, value);");
  push("  }");
  push("  const darkColors = config.theme.darkColors || {};");
  push("  const darkMatch = styles.match(/body\\s*\\.dark-theme\\s*\\{([^}]*)\\}/);");
  push("  if (darkMatch && Object.keys(darkColors).length > 0) {");
  push("    let block = darkMatch[1];");
  push("    for (const [key, value] of Object.entries(darkColors)) {");
  push("      block = block.replace(new RegExp('(' + key + ':\\\\s*)[^;]+(;)', 'g'), '$1' + value + '$2');");
  push("    }");
  push("    styles = styles.replace(darkMatch[0], 'body.dark-theme {' + block + '}');");
  push("  }");
  push("  writeFileSync(stylesPath, styles, 'utf-8');");
  push("  console.log('  Colores aplicados en src/styles.scss');");
  push("} else {");
  push("  console.warn('  No se encontro src/styles.scss');");
  push("}");
  push("");
  push("const excludedPages = " + excluded + ";");
  push("if (excludedPages.length > 0) {");
  push("  console.log('Eliminando ' + excludedPages.length + ' pagina(s)...');");
  push("  const pagesDir = join(__dirname, 'src', 'app', 'pages');");
  push("  for (const page of excludedPages) {");
  push("    const pagePath = join(pagesDir, page.folder);");
  push("    if (existsSync(pagePath)) {");
  push("      rmSync(pagePath, { recursive: true, force: true });");
  push("      console.log('  Eliminado: src/app/pages/' + page.folder);");
  push("    }");
  push("  }");
  push("}");
  push("");
  push("const routesPath = join(__dirname, 'src', 'app', 'app.routes.ts');");
  push("if (existsSync(routesPath)) {");
  push("  let routes = readFileSync(routesPath, 'utf-8');");
  push("  for (const page of excludedPages) {");
  push("    for (const routePath of page.routes) {");
  push("      routes = routes.replace(new RegExp('\\\\s*\\\\{[^}]*path: [\\'\\\"]' + routePath + '[\\'\\\"][^}]*\\\\}(\\\\n?\\\\s*,)?', 'gs'), '');");
  push("    }");
  push("  }");
  push("  writeFileSync(routesPath, routes, 'utf-8');");
  push("  console.log('  Rutas actualizadas');");
  push("}");
  push("");
  push("const sidebarPath = join(__dirname, 'src', 'app', 'shared', 'sidebar', 'sidebar.component.ts');");
  push("if (existsSync(sidebarPath)) {");
  push("  let sidebar = readFileSync(sidebarPath, 'utf-8');");
  push("  for (const page of excludedPages) {");
  push("    sidebar = sidebar.replace(new RegExp('\\\\s*\\\\{[^}]*id: [\\'\\\"]' + page.id + '[\\'\\\"][^}]*\\\\}(\\\\n?\\\\s*,)?', 'gs'), '');");
  push("  }");
  push("  writeFileSync(sidebarPath, sidebar, 'utf-8');");
  push("  console.log('  Sidebar actualizado');");
  push("}");
  push("");
  push("if (existsSync(stylesPath)) {");
  push("  let styles = readFileSync(stylesPath, 'utf-8');");
  push("  styles = styles.replace(new RegExp('(--sidebar-width:\\\\s*)[^;]+(;)', 'g'), '$1" + sidebarWidth + "px$2');");
  push("  styles = styles.replace(new RegExp('(--sidebar-collapsed-width:\\\\s*)[^;]+(;)', 'g'), '$1" + sidebarCollapsed + "px$2');");
  push("  styles = styles.replace(new RegExp('(--content-radius:\\\\s*)[^;]+(;)', 'g'), '$1" + contentRadius + "px$2');");
  push("  styles = styles.replace(new RegExp('(--transition-speed:\\\\s*)[^;]+(;)', 'g'), '$1" + transitionSpeed + "s$2');");
  push("  writeFileSync(stylesPath, styles, 'utf-8');");
  push("  console.log('  Layout aplicado');");
  push("}");
  push("");
  push("const pkgPath = join(__dirname, 'package.json');");
  push("if (existsSync(pkgPath)) {");
  push("  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));");
  push("  if (!config.dependencies['chart.js']) {");
  push("    delete pkg.dependencies['chart.js']; delete pkg.dependencies['ng2-charts'];");
  push("    console.log('  Dependencias eliminadas: chart.js, ng2-charts');");
  push("  }");
  push("  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');");
  push("}");
  push("");
  push("console.log('Configuracion aplicada correctamente!');");
  push("console.log('Ejecuta npm install si se eliminaron dependencias.');");

  return lines.join('\n');
}
