import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CarritoService } from '../../../core/services/carrito.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  // Inyectamos nuestros servicios globales
  private authService = inject(AuthService);
  private carritoService = inject(CarritoService);

  // Exponemos las Signals a la vista para que sea reactiva
  public isAuthenticated = this.authService.isAuthenticated;
  public isAdmin = this.authService.isAdmin;
  public currentUser = this.authService.currentUser;

  public cantidadItems = this.carritoService.cantidadItems;

  // Método para cerrar sesión
  onLogout() {
    this.authService.logout();
  }
}
