import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/breadcrumb/breadcrumb.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../core/services/notification.service';
import { ProductFormDialogComponent, ProductFormData } from './product-form-dialog.component';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [CommonModule, MatDialogModule, BreadcrumbComponent, ProductFormDialogComponent],
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

  stats = [
    { label: 'Productos', value: '248', change: '+12%', icon: 'ti-package', positive: true },
    { label: 'Ventas hoy', value: '$3,240', change: '+8.5%', icon: 'ti-shopping-cart', positive: true },
    { label: 'Pedidos', value: '156', change: '-2.1%', icon: 'ti-receipt', positive: false },
    { label: 'Ingresos', value: '$45,890', change: '+15.3%', icon: 'ti-currency-dollar', positive: true }
  ];

  products = signal<Product[]>([
    { id: 1, name: 'MacBook Pro 16"', price: 2499, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', category: 'Electrónica', stock: 24, status: 'active' },
    { id: 2, name: 'iPhone 15 Pro', price: 1199, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop', category: 'Electrónica', stock: 56, status: 'active' },
    { id: 3, name: 'AirPods Pro', price: 249, image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop', category: 'Accesorios', stock: 120, status: 'active' },
    { id: 4, name: 'iPad Air', price: 799, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop', category: 'Electrónica', stock: 34, status: 'active' },
    { id: 5, name: 'Apple Watch Ultra', price: 899, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=300&fit=crop', category: 'Wearables', stock: 45, status: 'active' },
    { id: 6, name: 'Magic Keyboard', price: 299, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop', category: 'Accesorios', stock: 0, status: 'inactive' },
    { id: 7, name: 'Studio Display', price: 1599, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop', category: 'Electrónica', stock: 12, status: 'active' },
    { id: 8, name: 'HomePod', price: 299, image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&h=300&fit=crop', category: 'Audio', stock: 67, status: 'active' }
  ]);

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
