import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private theme = inject(ThemeService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  readonly isDark = this.theme.isDark;
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });
  submitted = false;

  get f() {
    return this.loginForm.controls;
  }

  toggleDarkMode(): void {
    this.theme.toggle();
  }

  login(): void {
    this.submitted = true;
    this.cdr.markForCheck();
    if (this.loginForm.invalid) return;

    // TODO: Replace with real auth service and store actual JWT token
    const { email } = this.loginForm.value;
    console.log('Login attempt:', email);
    localStorage.setItem('josidk-token', 'dummy-jwt-token');
    this.router.navigate(['/']);
  }
}
