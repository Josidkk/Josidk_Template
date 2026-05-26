import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'users', component: UserListComponent },
      // Here you will add your dashboard routes in the future
      // { path: 'analytical', component: AnalyticalComponent },
      // { path: '', redirectTo: 'analytical', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    redirectTo: 'login' // Redirect to login for unknown routes for now
  }
];
