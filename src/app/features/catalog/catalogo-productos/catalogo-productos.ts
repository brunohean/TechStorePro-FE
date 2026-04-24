
import { Component, OnInit } from '@angular/core';
import { Producto } from '../../../shared/models/producto.model';
import { ProductoService } from '../../../core/services/producto.service';

@Component({
  selector: 'app-catalogo-productos',
  standalone: true,
  imports: [],
  templateUrl: './catalogo-productos.html',
  styleUrl: './catalogo-productos.css',
})
export class CatalogoProductos implements OnInit {
  productos: Producto[] = [];

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        // Solo mostramos productos que estén activos en la BD
        this.productos = data.filter((p) => p.activo);
      },
      error: (err) => console.error('Error al cargar el catálogo:', err)
    })
  }
}
