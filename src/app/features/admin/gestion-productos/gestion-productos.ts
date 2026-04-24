import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../shared/models/producto.model';
import { ProductoService } from '../../../core/services/producto.service';

@Component({
  selector: 'app-gestion-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-productos.html',
  styleUrl: './gestion-productos.css',
})
export class GestionProductos {
  producto: Producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagenes: [],
    activo: true,
  };

  // Arreglo para almacenar los archivos físicos antes de enviarlos
  archivosSeleccionados: File[] = [];
  mensaje: string = '';

  constructor(private productoService: ProductoService) {}

  // Método que se dispara al seleccionar fotos en el input
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      // Convertimos el FileList del navegador a un arreglo de TypeScript
      this.archivosSeleccionados = Array.from(event.target.files);
    }
  }

  // Método que se ejecuta al darle al botón "Guardar"
  crear() {
    this.productoService
      .crearProducto(this.producto, this.archivosSeleccionados)
      .subscribe({
        next: (res) => {
          this.mensaje =
            '🚀 ¡Producto creado con éxito! Las imágenes se enviaron a Cloudinary.';
          // Reseteamos el formulario
          this.producto = {
            nombre: '',
            descripcion: '',
            precio: 0,
            stock: 0,
            imagenes: [],
            activo: true,
          };
          this.archivosSeleccionados = [];
        },
        error: (err) => {
          console.error('Error del Backend:', err);
          this.mensaje =
            '❌ Hubo un error al crear el producto. Verifica que el servidor de Spring Boot esté encendido.';
        },
      });
  }
}
