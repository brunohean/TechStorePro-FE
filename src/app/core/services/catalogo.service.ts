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

  getProductosCatalogo(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_URL);
  }
}
