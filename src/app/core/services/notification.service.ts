import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CustomSnackbarComponent, SnackbarData } from '../../shared/custom-snackbar/custom-snackbar.component';

/**
 * Servicio centralizado de notificaciones con snackbars glassmorphism.
 * Inyectarlo en cualquier componente y usar:
 *   notify.success(), notify.error(), notify.warning(), notify.info(), notify.loading(), notify.neutral()
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
    panelClass: ['snackbar-panel'],
  };

  private openSnackbar(
    data: SnackbarData,
    config: Partial<MatSnackBarConfig> = {}
  ): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      ...this.defaultConfig,
      ...config,
      data,
    });
  }

  success(title: string, description?: string, action?: string): void {
    this.openSnackbar({
      type: 'success',
      title,
      description,
      action: action || 'Deshacer',
    });
  }

  error(title: string, description?: string, action?: string): void {
    this.openSnackbar(
      {
        type: 'error',
        title,
        description,
        action: action || 'Reintentar',
      },
      { duration: 6000 }
    );
  }

  warning(title: string, description?: string, action?: string): void {
    this.openSnackbar({
      type: 'warning',
      title,
      description,
      action: action || 'Renovar',
    });
  }

  info(title: string, description?: string, action?: string): void {
    this.openSnackbar({
      type: 'info',
      title,
      description,
      action: action || 'Ver más',
    });
  }

  loading(title: string, description?: string): void {
    this.openSnackbar(
      {
        type: 'purple',
        title,
        description,
      },
      { duration: 0 }
    );
  }

  neutral(title: string, description?: string): void {
    this.openSnackbar({
      type: 'neutral',
      title,
      description,
    });
  }
}
