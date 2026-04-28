import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
// En Angular 21 Standalone, no necesitas CommonModule si solo usas la nueva sintaxis @if / @for

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Estados de la UI manejados con Signals
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Formulario Reactivo
  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null); // Limpiamos errores previos

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Redirección inteligente basada en el rol
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/productos']);
        } else {
          this.router.navigate(['/catalog']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        // Manejo de errores directamente en la UI (Cero alertas nativas)
        if (err.status === 401 || err.status === 403) {
          this.errorMessage.set(
            'Credenciales incorrectas. Verifica tu usuario y contraseña.',
          );
        } else {
          this.errorMessage.set(
            'Error de conexión con el servidor de TechStore Pro.',
          );
        }
      },
    });
  }
}
