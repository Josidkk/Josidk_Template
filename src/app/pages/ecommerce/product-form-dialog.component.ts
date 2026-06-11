import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ProductFormData {
  id?: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
}

export interface ProductDialogResult {
  action: 'save' | 'delete';
  data: ProductFormData;
}

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './product-form-dialog.component.html',
  styleUrl: './product-form-dialog.component.scss',
})
export class ProductFormDialogComponent {
  dialogRef = inject(MatDialogRef<ProductFormDialogComponent>);
  data = inject<{ product?: ProductFormData }>(MAT_DIALOG_DATA);

  isEdit = signal(!!this.data?.product);

  form: ProductFormData = this.data?.product
    ? { ...this.data.product }
    : { name: '', price: 0, image: '', category: 'Electrónica', stock: 0, status: 'active' };

  isValidUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image');
  }

  isValid(): boolean {
    return this.form.name.trim().length > 0 && this.form.price > 0;
  }

  save(): void {
    if (!this.isValid()) return;
    this.dialogRef.close({ action: 'save', data: this.form });
  }
}
