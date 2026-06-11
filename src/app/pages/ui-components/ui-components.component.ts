import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';
import { NotificationService } from '../../core/services/notification.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/confirm-dialog/confirm-dialog.component';
import { InfoDialogComponent, InfoDialogData } from '../../shared/info-dialog/info-dialog.component';

@Component({
  selector: 'app-ui-components',
  standalone: true,
  imports: [
    CommonModule, BreadcrumbComponent, MatDialogModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ui-components.component.html',
  styleUrl: './ui-components.component.scss',
})
export class UiComponentsComponent {
  private notify = inject(NotificationService);
  private dialog = inject(MatDialog);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'UI Components' },
  ];

  readonly notifyService = this.notify;

  /* ── Snackbar demos ── */
  showSuccess(): void {
    this.notify.success('Operación completada correctamente');
  }

  showError(): void {
    this.notify.error('Ocurrió un error al procesar la solicitud');
  }

  showWarning(): void {
    this.notify.warning('Tu sesión expirará en 5 minutos');
  }

  showInfo(): void {
    this.notify.info('Sincronizando datos con el servidor...');
  }

  /* ── Confirm dialog demos ── */
  confirmDanger(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar registro',
        message: '¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'danger',
      } as ConfirmDialogData,
      panelClass: 'glass-dialog-overlay',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notify.success('Registro eliminado correctamente');
      }
    });
  }

  confirmWarning(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cambios sin guardar',
        message: 'Tienes cambios pendientes que se perderán si sales de esta página. ¿Deseas continuar?',
        confirmText: 'Salir',
        cancelText: 'Quedarse',
        type: 'warning',
      } as ConfirmDialogData,
      panelClass: 'glass-dialog-overlay',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notify.info('Saliendo de la página...');
      }
    });
  }

  confirmInfo(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Actualizar sistema',
        message: 'Hay una nueva versión disponible. ¿Deseas actualizar ahora? El sistema se reiniciará brevemente.',
        confirmText: 'Actualizar',
        cancelText: 'Más tarde',
        type: 'info',
      } as ConfirmDialogData,
      panelClass: 'glass-dialog-overlay',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notify.info('Actualización en progreso...');
      }
    });
  }

  /* ── Info Modal demo ── */
  openInfoModal(): void {
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      data: {
        title: '¡Bienvenido al sistema!',
        message: 'Has iniciado sesión correctamente. Desde aquí podrás gestionar usuarios, productos y revisar tus estadísticas en tiempo real.',
        icon: 'ti ti-sparkles',
        confirmText: 'Comenzar',
        cancelText: 'Cerrar',
      } as InfoDialogData,
      panelClass: 'glass-dialog-overlay',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notify.success('¡Listo para trabajar!');
      }
    });
  }

}
