import { Routes } from '@angular/router';
import { GestionProductos } from './features/admin/gestion-productos/gestion-productos';
import { CatalogoProductos } from './features/catalog/catalogo-productos/catalogo-productos';

export const routes: Routes = [
  // Ruta para el Administrador
  { path: 'admin/productos', component: GestionProductos },

  // Ruta para los Clientes
  { path: 'catalogo', component: CatalogoProductos },

  // Redirección por defecto: si el usuario entra a la raíz, lo mandamos al catálogo
  { path: '', redirectTo: '/catalogo', pathMatch: 'full' },

  // Comodín para rutas inexistentes (404)
  { path: '**', redirectTo: '/catalogo' },
];
