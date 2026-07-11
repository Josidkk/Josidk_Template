import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private theme = inject(ThemeService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  readonly isDark = this.theme.isDark;
  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    terms: [false, Validators.requiredTrue],
  });
  submitted = false;

  get f() {
    return this.registerForm.controls;
  }

  toggleDarkMode(): void {
    this.theme.toggle();
  }

  register(): void {
    this.submitted = true;
    this.cdr.markForCheck();
    if (this.registerForm.invalid) {
      // Con el teclado móvil abierto el error puede quedar fuera del viewport:
      // enfocar el primer campo inválido lo trae a la vista en cualquier dispositivo
      setTimeout(() => document.querySelector<HTMLInputElement>('.input-wrapper.input-error input')?.focus());
      return;
    }

    // TODO: Replace with real auth service
    const { email } = this.registerForm.value;
    console.log('Register attempt:', email);
    localStorage.setItem('josidk-token', 'dummy-jwt-token');
    this.router.navigate(['/']);
  }
}
