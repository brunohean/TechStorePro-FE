import { Routes } from '@angular/router';
import { GestionProductos } from './features/admin/gestion-productos/gestion-productos';
import { CatalogoProductos } from './features/catalog/catalogo-productos/catalogo-productos';
import { Login } from './features/auth/login/login';
import { adminGuard } from './core/guards/auth-guard';
import { Carrito } from './features/cart/carrito/carrito';
import { CheckoutIdentificacion } from './features/cart/checkout-identificacion/checkout-identificacion';
import { cartNotEmptyGuard } from './core/guards/cart-not-empty-guard';
import { CheckoutConfirmacion } from './features/cart/checkout-confirmacion/checkout-confirmacion';

// Bloquear por rutas, NO por Roles
export const routes: Routes = [
  // Rutas Públicas
  { path: 'catalogo', component: CatalogoProductos },
  { path: 'auth/login', component: Login },

  // Rutas Protegidas
  { path: 'carrito', component: Carrito },
  {
    path: 'checkout/identificacion',
    component: CheckoutIdentificacion,
    canActivate: [cartNotEmptyGuard], // Seguridad activa
  },
  { path: 'checkout/confirmacion', component: CheckoutConfirmacion },

  // Rutas de Administración (Admins)
  {
    path: 'admin/productos',
    component: GestionProductos,
    canActivate: [adminGuard],
  },

  // Redirección por defecto: si el usuario entra a la raíz, lo mandamos al catálogo
  { path: '', redirectTo: '/catalogo', pathMatch: 'full' },
  // Comodín para rutas inexistentes (404)
  { path: '**', redirectTo: '/catalogo' },
];
