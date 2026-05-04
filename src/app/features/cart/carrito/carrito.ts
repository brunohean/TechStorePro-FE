import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarritoService } from '../../../core/services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  carritoService = inject(CarritoService);
  private router = inject(Router);

  // Exponemos las Signals
  items = this.carritoService.items;
  total = this.carritoService.total;
  cantidad = this.carritoService.cantidadItems;

  actualizarImagenDefault(event: any) {
    // Imagen Tech de respaldo por si falla la carga de Cloudinary
    event.target.src =
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=100';
  }

  irAIdentificacion() {
    this.router.navigate(['/checkout/identificacion']);
  }
}
