
import { Component, inject, OnInit } from '@angular/core';
import { Producto } from '../../../shared/models/producto.model';
import { ProductoService } from '../../../core/services/producto.service';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../../core/services/carrito';

@Component({
  selector: 'app-catalogo-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo-productos.html',
  styleUrl: './catalogo-productos.css',
})
export class CatalogoProductos implements OnInit {
  productos: Producto[] = [];

  // Inyectamos los servicios usando la nueva sintaxis
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService); // <-- Inyección del carrito

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        // Solo mostramos productos que estén activos en la BD
        this.productos = data.filter((p) => p.activo);
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
