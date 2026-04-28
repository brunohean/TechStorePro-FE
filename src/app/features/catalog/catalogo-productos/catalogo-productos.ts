import { Component, inject, OnInit } from '@angular/core';
import { Producto } from '../../../shared/models/producto.model';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../../core/services/carrito.service';

@Component({
  selector: 'app-catalogo-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo-productos.html',
  styleUrl: './catalogo-productos.css',
})
export class CatalogoProductos implements OnInit {
  // Inyectamos los servicios usando la nueva sintaxis
  private carritoService = inject(CarritoService); // <-- Inyección del carrito
  private catalogoService = inject(CatalogoService);

  productos: Producto[] = [];

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.catalogoService.getProductosCatalogo().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => console.error('Error al cargar el catálogo:', err),
    });
  }

  // NUEVO MÉTODO: Se dispara al hacer clic en el botón
  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarProducto(producto);
    console.log(`${producto.nombre} añadido al carrito!`);
  }
}
