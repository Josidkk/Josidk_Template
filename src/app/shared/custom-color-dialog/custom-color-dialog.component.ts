import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface CustomColorData {
  name?: string;
  variables: Record<string, string>;
  darkVariables: Record<string, string>;
}

export interface ColorPickerField {
  key: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-custom-color-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './custom-color-dialog.component.html',
  styleUrl: './custom-color-dialog.component.scss',
})
export class CustomColorDialogComponent {
  private dialogRef = inject(MatDialogRef<CustomColorDialogComponent>);
  private incoming = inject(MAT_DIALOG_DATA) as CustomColorData | null;

  /* ─── Fields definition ─── */
  lightFields: ColorPickerField[] = [
    { key: '--primary', label: 'Color primario', description: 'Botones, enlaces activos, acentos principales' },
    { key: '--sidebar-bg', label: 'Fondo del sidebar', description: 'Panel lateral de navegación' },
    { key: '--main-bg', label: 'Fondo general', description: 'Fondo de toda la aplicación' },
    { key: '--content-bg', label: 'Fondo de contenido', description: 'Tarjetas, paneles y contenedores' },
    { key: '--accent-warm', label: 'Color de acento', description: 'Barras activas y detalles decorativos' },
    { key: '--text-primary', label: 'Color de texto', description: 'Titulares y texto principal' },
  ];

  darkFields: ColorPickerField[] = [
    { key: '--primary', label: 'Color primario', description: 'Brillante para destacar en fondo oscuro' },
    { key: '--sidebar-bg', label: 'Fondo del sidebar', description: 'Panel lateral en modo oscuro' },
    { key: '--main-bg', label: 'Fondo general', description: 'Fondo oscuro principal' },
    { key: '--content-bg', label: 'Fondo de contenido', description: 'Tarjetas y paneles en modo oscuro' },
    { key: '--accent-warm', label: 'Color de acento', description: 'Detalles decorativos en modo oscuro' },
    { key: '--text-primary', label: 'Color de texto', description: 'Texto claro sobre fondo oscuro' },
  ];

  /* ─── Colors (light) ─── */
  lightColors: Record<string, string>;
  /* ─── Colors (dark) ─── */
  darkColors: Record<string, string>;

  constructor() {
    const base = this.incoming?.variables || {};
    const darkBase = this.incoming?.darkVariables || {};
    this.lightColors = {
      '--primary': base['--primary'] || '#1A1208',
      '--sidebar-bg': base['--sidebar-bg'] || '#0F0F0E',
      '--main-bg': base['--main-bg'] || '#F4F2ED',
      '--content-bg': base['--content-bg'] || '#FDFAF5',
      '--accent-warm': base['--accent-warm'] || '#C8B896',
      '--text-primary': base['--text-primary'] || '#1A1208',
    };
    this.darkColors = {
      '--primary': darkBase['--primary'] || '#D4A853',
      '--sidebar-bg': darkBase['--sidebar-bg'] || '#0F0F0E',
      '--main-bg': darkBase['--main-bg'] || '#0C0C0B',
      '--content-bg': darkBase['--content-bg'] || '#161614',
      '--accent-warm': darkBase['--accent-warm'] || '#C8B896',
      '--text-primary': darkBase['--text-primary'] || '#F0EDE6',
    };
  }

  /** Computa estilos inline para el preview (solo dentro del modal, no afecta :root). */
  get previewStyles(): Record<string, string> {
    const c = this.lightColors;
    // Texto claro fijo para sidebar porque el sidebar siempre es oscuro en todas las paletas
    const sidebarTextLight = 'rgba(255, 255, 255, 0.35)';
    return {
      '--primary': c['--primary'],
      '--sidebar-bg': c['--sidebar-bg'],
      '--main-bg': c['--main-bg'],
      '--content-bg': c['--content-bg'],
      '--accent-warm': c['--accent-warm'],
      '--text-primary': c['--text-primary'],
      '--navbar-bg': c['--content-bg'],
      '--navbar-border': c['--content-bg'],
      '--sidebar-text': sidebarTextLight,
      '--sidebar-text-active': '#E9E3D6',
      '--card-bg': c['--content-bg'],
      '--card-border': c['--content-bg'],
      '--sidebar-active-bar': c['--accent-warm'],
    };
  }

  /** Updates a light color value — solo cambia el estado local, no toca :root. */
  updateLight(key: string, value: string): void {
    this.lightColors[key] = value;
  }

  /** Updates a dark color value — solo cambia el estado local, no toca :root. */
  updateDark(key: string, value: string): void {
    this.darkColors[key] = value;
  }

  /** Builds the full variable map (light + derived) from user picks. */
  private buildVariables(): Record<string, string> {
    const h = CustomColorDialogComponent;
    const p = this.lightColors;
    const primary = p['--primary'];
    const text = p['--text-primary'];
    const rgb = h.hexToRgb(primary);
    const textRgb = h.hexToRgb(text);
    return {
      '--primary': primary,
      '--primary-light': rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)` : h.lighten(primary, 40),
      '--accent-warm': p['--accent-warm'],
      '--accent-warm-dark': h.lighten(p['--accent-warm'], -15),
      '--sidebar-bg': p['--sidebar-bg'],
      '--sidebar-text-active': h.lighten(text, 60),
      '--sidebar-active-bar': p['--accent-warm'],
      '--sidebar-active-bg': textRgb ? `rgba(${textRgb.r}, ${textRgb.g}, ${textRgb.b}, 0.10)` : 'rgba(0,0,0,0.10)',
      '--main-bg': p['--main-bg'],
      '--content-bg': p['--content-bg'],
      '--card-bg': p['--content-bg'],
      '--card-border': 'rgba(0,0,0,0.09)',
      '--navbar-bg': p['--content-bg'],
      '--navbar-border': 'rgba(0,0,0,0.07)',
      '--text-primary': text,
      '--text-secondary': textRgb ? `rgba(${textRgb.r}, ${textRgb.g}, ${textRgb.b}, 0.42)` : 'rgba(0,0,0,0.42)',
    };
  }

  /** Builds dark variable map from user picks. */
  private buildDarkVariables(): Record<string, string> {
    const h = CustomColorDialogComponent;
    const d = this.darkColors;
    const primary = d['--primary'];
    const text = d['--text-primary'];
    const rgb = h.hexToRgb(primary);
    const textRgb = h.hexToRgb(text);
    return {
      '--primary': primary,
      '--primary-light': rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)` : h.lighten(primary, 20),
      '--accent-warm': d['--accent-warm'],
      '--accent-warm-dark': h.lighten(d['--accent-warm'], -15),
      '--sidebar-bg': d['--sidebar-bg'],
      '--sidebar-text-active': h.lighten(text, -10),
      '--sidebar-active-bar': d['--accent-warm'],
      '--sidebar-active-bg': rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18)` : 'rgba(255,255,255,0.18)',
      '--main-bg': d['--main-bg'],
      '--content-bg': d['--content-bg'],
      '--card-bg': d['--content-bg'],
      '--card-border': textRgb ? `rgba(${textRgb.r}, ${textRgb.g}, ${textRgb.b}, 0.08)` : 'rgba(255,255,255,0.08)',
      '--navbar-bg': d['--content-bg'],
      '--navbar-border': 'rgba(255,255,255,0.08)',
      '--text-primary': text,
      '--text-secondary': textRgb ? `rgba(${textRgb.r}, ${textRgb.g}, ${textRgb.b}, 0.50)` : 'rgba(255,255,255,0.50)',
    };
  }

  /** Apply and close with result. */
  apply(): void {
    const result: CustomColorData = {
      name: 'Personalizada',
      variables: this.buildVariables(),
      darkVariables: this.buildDarkVariables(),
    };
    this.dialogRef.close(result);
  }

  /** Cancel and restore original preview. */
  cancel(): void {
    // Restore the palette that was active before opening
    this.dialogRef.close(null);
  }

  /* ─── Helpers ─── */

  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const match = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!match) return null;
    return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) };
  }

  /** Lighten (positive) or darken (negative) a hex color by a percentage. */
  private static lighten(hex: string, percent: number): string {
    const rgb = CustomColorDialogComponent.hexToRgb(hex);
    if (!rgb) return hex;
    const factor = 1 + percent / 100;
    const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v * factor)));
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(clamp(rgb.r))}${toHex(clamp(rgb.g))}${toHex(clamp(rgb.b))}`;
  }
}
