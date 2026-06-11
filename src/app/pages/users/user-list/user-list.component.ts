import { Component, OnInit, ViewChild, AfterViewInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb.component';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/confirm-dialog/confirm-dialog.component';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Pending' | 'Inactive';
  avatar?: string;
  lastLogin: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, BreadcrumbComponent, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})

export class UserListComponent implements OnInit, AfterViewInit {
  private notify = inject(NotificationService);
  private dialog = inject(MatDialog);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Aplicaciones', route: '/users' },
    { label: 'Usuarios' }
  ];

  displayedColumns: string[] = ['user', 'role', 'status', 'lastLogin', 'actions'];
  dataSource = new MatTableDataSource<User>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Mock data for demo
  users: User[] = [
    { id: 'USR-001', name: 'Deyby Josue', email: 'deyby@josidk.com', role: 'Admin', status: 'Active', lastLogin: 'Hace 2 horas', avatar: 'ti ti-user-circle' },
    { id: 'USR-002', name: 'Ana Rodriguez', email: 'ana.r@josidk.com', role: 'Editor', status: 'Active', lastLogin: 'Hace 5 horas' },
    { id: 'USR-003', name: 'Carlos Mendez', email: 'carlos.m@josidk.com', role: 'Viewer', status: 'Pending', lastLogin: 'Nunca' },
    { id: 'USR-004', name: 'Laura Sanchez', email: 'laura.s@josidk.com', role: 'Editor', status: 'Inactive', lastLogin: 'Hace 2 días' },
    { id: 'USR-005', name: 'Roberto Gomez', email: 'roberto.g@josidk.com', role: 'Viewer', status: 'Active', lastLogin: 'Hace 1 hora' },
    { id: 'USR-006', name: 'Maria Lopez', email: 'maria.l@josidk.com', role: 'Viewer', status: 'Active', lastLogin: 'Ayer' },
    { id: 'USR-007', name: 'Jorge Perez', email: 'jorge.p@josidk.com', role: 'Admin', status: 'Inactive', lastLogin: 'Hace 1 semana' }
  ];

  ngOnInit() {
    this.dataSource.data = this.users;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editUser(user: User) {
    this.notify.info(`Editando usuario: ${user.name}`);
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar usuario',
        message: `¿Estás seguro de que deseas eliminar a ${user.name}? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'danger',
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.users = this.users.filter(u => u.id !== user.id);
        this.dataSource.data = this.users;
        this.notify.success(`Usuario ${user.name} eliminado correctamente`);
      }
    });
  }
}
