import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../shared/models/producto.model';
import { ProductoService } from '../../../core/services/producto.service';

@Component({
  selector: 'app-gestion-productos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gestion-productos.html',
  styleUrl: './gestion-productos.css',
})
export class GestionProductos {
  private productoService = inject(ProductoService);

  producto: Producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    activo: true,
  };

  // Arreglo para almacenar los archivos físicos antes de enviarlos
  archivosSeleccionados: File[] = [];
  mensaje: string = '';

  // Método que se dispara al seleccionar fotos en el input
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      // Convertimos el FileList del navegador a un arreglo de TypeScript
      this.archivosSeleccionados = Array.from(event.target.files);
    }
  }

  // Método que se ejecuta al darle al botón "Guardar"
  crear() {
    const formData = new FormData();

    // 1. Empaquetamos el texto del producto como un Blob JSON
    const productoBlob = new Blob([JSON.stringify(this.producto)], {
      type: 'application/json',
    });
    formData.append('producto', productoBlob);

    // 2. Empaquetamos cada imagen física
    // 'imagenes' DEBE coincidir con el @RequestPart("imagenes") en Spring Boot
    this.archivosSeleccionados.forEach((archivo) => {
      formData.append('imagenes', archivo);
    });

    // 3. Enviamos al servicio
    this.productoService.crearProductoConImagenes(formData).subscribe({
      next: (res) => {
        this.mensaje =
          '🚀 ¡Producto creado con éxito! Las imágenes se enviaron a Cloudinary.';
        this.resetForm();
      },
      error: (err) => {
        this.mensaje = '❌ Error al crear el producto. Revisa la consola.';
        console.error(err);
      },
    });
  }

  resetForm() {
    this.producto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      activo: true,
    };
    this.archivosSeleccionados = [];
    // Nota: Para limpiar visualmente el input file en el HTML, requerirías un ViewChild,
    // pero a nivel lógico el arreglo ya está vacío.
  }
}
