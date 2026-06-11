import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

/**
 * Guard that prevents unauthenticated users from accessing protected routes.
 * Currently uses a simple token check — swap for your real auth logic.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('josidk-token');
    if (token) {
      return true;
    }
    return this.router.createUrlTree(['/login']);
  }
}
