import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CarritoService } from '../services/carrito.service';

export const cartNotEmptyGuard: CanActivateFn = (route, state) => {
  const carritoService = inject(CarritoService);
  const router = inject(Router);

  if (carritoService.items().length === 0) {
    router.navigate(['/catalogo']);
    return false;
  }

  return true;
};
