import { Component, inject, OnInit } from '@angular/core';
import { Producto } from '../../../shared/models/producto.model';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CarritoService } from '../../../core/services/carrito.service';

@Component({
  selector: 'app-catalogo-productos',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './catalogo-productos.html',
  styleUrl: './catalogo-productos.css',
})
export class CatalogoProductos implements OnInit {
  // Inyectamos los servicios usando la nueva sintaxis
  private carritoService = inject(CarritoService); // <-- Inyección del carrito
  private catalogoService = inject(CatalogoService);

  productos: Producto[] = [];

  paginaActual: number = 0;
  totalPaginas: number = 1;
  esPrimeraPagina: boolean = true;
  esUltimaPagina: boolean = false;

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.catalogoService.getProductosCatalogo(this.paginaActual).subscribe({
      next: (data) => {
        // REEMPLAZAMOS el arreglo, no lo acumulamos (Protege la RAM)
        this.productos = data.content;

        // Actualizamos las banderas de Spring Boot
        this.totalPaginas = data.totalPages;
        this.esPrimeraPagina = data.first;
        this.esUltimaPagina = data.last;

        // UX: Regresar al inicio de la página suavemente al cambiar de página
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => console.error('Error al cargar el catálogo:', err),
    });
  }

  irPaginaAnterior() {
    if (!this.esPrimeraPagina) {
      this.paginaActual--;
      this.cargarProductos();
    }
  }

  irPaginaSiguiente() {
    if (!this.esUltimaPagina) {
      this.paginaActual++;
      this.cargarProductos();
    }
  }

  // NUEVO MÉTODO: Se dispara al hacer clic en el botón
  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarProducto(producto);
    console.log(`${producto.nombre} añadido al carrito!`);
  }
}
