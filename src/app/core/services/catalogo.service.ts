import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Producto } from '../../shared/models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  private http = inject(HttpClient);

  // Apuntamos estrictamente a la ruta segregada de lectura pública
  private readonly API_URL = `${environment.apiUrl}/productos/catalogo`;

  // Pedimos 10 por defecto para mantener el grid simétrico
  getProductosCatalogo(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.API_URL}?page=${page}&size=${size}`);
  }
}
