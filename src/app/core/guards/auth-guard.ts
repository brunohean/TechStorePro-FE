import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// 1. Guard General: Solo verifica si hay un usuario logueado (Ej: para ir a pagar el carrito)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // Permite el paso
  }

  // CISO Compliance: Si intenta entrar sin sesión, lo enviamos al login
  router.navigate(['/auth/login']);
  return false;
};

// 2. Guard Estricto: Verifica sesión Y rol de Administrador (Ej: para crear productos)
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificamos ambas Signals reactivas
  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  // Si no es admin, lo devolvemos al catálogo (o podrías enviarlo a una vista 403)
  router.navigate(['/catalog']);
  return false;
};
