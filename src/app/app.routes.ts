import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/user-list/user-list.component').then(m => m.UserListComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.component').then(m => m.SettingsComponent),
      },
      {
        path: 'ui-components',
        loadComponent: () =>
          import('./pages/ui-components/ui-components.component').then(m => m.UiComponentsComponent),
      },
      {
        path: 'material/buttons',
        loadComponent: () =>
          import('./pages/material/material-buttons.component').then(m => m.MaterialButtonsComponent),
      },
      {
        path: 'material/data',
        loadComponent: () =>
          import('./pages/material/material-data.component').then(m => m.MaterialDataComponent),
      },
      {
        path: 'material/feedback',
        loadComponent: () =>
          import('./pages/material/material-feedback.component').then(m => m.MaterialFeedbackComponent),
      },
      {
        path: 'material/inputs',
        loadComponent: () =>
          import('./pages/material/material-inputs.component').then(m => m.MaterialInputsComponent),
      },
      {
        path: 'material/navigation',
        loadComponent: () =>
          import('./pages/material/material-navigation.component').then(m => m.MaterialNavigationComponent),
      },
      {
        path: 'material/charts',
        loadComponent: () =>
          import('./pages/material/material-charts.component').then(m => m.MaterialChartsComponent),
      },
      {
        path: 'material',
        redirectTo: 'material/buttons',
        pathMatch: 'full',
      },
      {
        path: 'kanban',
        loadComponent: () =>
          import('./pages/kanban/kanban.component').then(m => m.KanbanComponent),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./pages/calendar/calendar.component').then(m => m.CalendarComponent),
      },
      {
        path: 'email',
        loadComponent: () =>
          import('./pages/email/email.component').then(m => m.EmailComponent),
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./pages/chat/chat.component').then(m => m.ChatComponent),
      },
      {
        path: 'ecommerce',
        loadComponent: () =>
          import('./pages/ecommerce/ecommerce.component').then(m => m.EcommerceComponent),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
