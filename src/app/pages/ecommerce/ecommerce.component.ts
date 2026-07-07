import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../core/services/notification.service';
import { ProductFormDialogComponent, ProductFormData } from './product-form-dialog.component';
import { Product, MOCK_PRODUCTS, MOCK_STATS } from './ecommerce.mock';

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, ProductFormDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ecommerce.component.html',
  styleUrl: './ecommerce.component.scss'
})
export class EcommerceComponent {
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'eCommerce' }
  ];

  private nextId = 9;

  stats = MOCK_STATS;

  products = signal<Product[]>(MOCK_PRODUCTS);

  openNewProduct(): void {
    const ref = this.dialog.open(ProductFormDialogComponent, {
      data: {},
      panelClass: 'glass-dialog-overlay',
      maxWidth: '90vw',
      width: '560px',
    });

    ref.afterClosed().subscribe(result => {
      if (result?.action === 'save') {
        const newProduct: Product = {
          id: this.nextId++,
          name: result.data.name,
          price: result.data.price,
          image: result.data.image,
          category: result.data.category,
          stock: result.data.stock,
          status: result.data.status,
        };
        this.products.update(list => [newProduct, ...list]);
        this.notify.success('Producto creado', `"${newProduct.name}" agregado correctamente`);
      }
    });
  }

  editProduct(product: Product): void {
    const ref = this.dialog.open(ProductFormDialogComponent, {
      data: { product },
      panelClass: 'glass-dialog-overlay',
      maxWidth: '90vw',
      width: '560px',
    });

    ref.afterClosed().subscribe(result => {
      if (result?.action === 'save') {
        this.products.update(list =>
          list.map(p => p.id === product.id ? { ...p, ...result.data, id: p.id } : p)
        );
        this.notify.info('Producto actualizado', `"${result.data.name}" guardado`);
      }
    });
  }

  deleteProduct(product: Product): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar producto',
        message: `¿Estás seguro de eliminar "${product.name}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'danger',
      } as ConfirmDialogData,
      panelClass: 'glass-dialog-overlay',
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.products.update(list => list.filter(p => p.id !== product.id));
        this.notify.warning('Producto eliminado', `"${product.name}" fue eliminado`);
      }
    });
  }
}
