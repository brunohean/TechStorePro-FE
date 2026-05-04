import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CarritoService } from './carrito.service';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { Pedido } from '../../shared/models/pedido.model';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private http = inject(HttpClient);
  private carritoService = inject(CarritoService);
  private readonly API_URL = `${environment.apiUrl}/pedidos/checkout`;

  registrarPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.API_URL, pedido).pipe(
      tap(() => {
        // Al tener éxito, el servicio se encarga de vaciar el estado local
        this.carritoService.limpiarCarrito();
      }),
    );
  }
}
