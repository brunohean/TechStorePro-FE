import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../shared/models/producto.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  // Apuntamos al endpoint que construimos en Spring Boot
  private urlProducto = `${environment.apiUrl}/productos`;
  private http = inject(HttpClient);

  // 1. Obtener todos los productos (Para iterar con *ngFor en el catálogo)
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.urlProducto);
  }

  // 2. Obtener un producto por ID (Para la vista de detalle)
  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.urlProducto}/${id}`);
  }

  // 3. Crear Producto con Imágenes (¡Nuestra migración a FormData!)
  crearProducto(producto: Producto, imagenes: File[]): Observable<Producto> {
    const formData = new FormData();

    // Convertimos el objeto producto a un Blob JSON.
    // Esto es crucial para que Spring Boot lo reciba correctamente con @RequestPart
    formData.append(
      'producto',
      new Blob([JSON.stringify(producto)], { type: 'application/json' }),
    );

    // Iteramos sobre el arreglo de archivos físicos y los adjuntamos
    if (imagenes && imagenes.length > 0) {
      imagenes.forEach((file) => {
        formData.append('imagenes', file, file.name);
      });
    }

    // Nota: NO enviamos encabezados 'Content-Type'.
    // Al usar FormData, el navegador automáticamente establece 'multipart/form-data'
    // y genera el 'boundary' correcto.
    return this.http.post<Producto>(this.urlProducto, formData);
  }

  crearProductoConImagenes(formData: FormData): Observable<any> {
    // Angular automáticamente configura el Content-Type a 'multipart/form-data'
    // y añade el boundary necesario. NO debes setear headers manualmente aquí.
    return this.http.post(this.urlProducto, formData);
  }

  // 4. Eliminar producto (Nuestro Borrado Ecológico que afecta a Cloudinary)
  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlProducto}/${id}`);
  }
}
