import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { CarritoItem } from '../../shared/models/carrito.model';
import { Producto } from '../../shared/models/producto.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { forkJoin, Observable, of, switchMap } from 'rxjs';

const API_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  // Nuestro estado global reactivo usando Signals
  private itemsSignal = signal<CarritoItem[]>([]);
  private http = inject(HttpClient);
  private readonly CARRITO_URL = `${API_URL}/carrito`;

  // 1. CARGA INICIAL: Al instanciar el servicio, recuperamos lo guardado
  constructor() {
    const carritoGuardado = localStorage.getItem('techstore_cart');
    if (carritoGuardado) {
      try {
        this.itemsSignal.set(JSON.parse(carritoGuardado));
      } catch (e) {
        console.error('Error al recuperar el carrito', e);
      }
    }

    // 2. EFECTO DE PERSISTENCIA: Cada vez que el Signal cambie, guardamos en LocalStorage
    // Esto es automático gracias a la API de Signals
    effect(() => {
      localStorage.setItem(
        'techstore_cart',
        JSON.stringify(this.itemsSignal()),
      );
    });
  }

  sincronizarCarritoConBackend(): Observable<any> {
    const items = this.itemsSignal();

    if (items.length === 0) {
      return of(null);
    }

    // PRUEBA RÁPIDA: Recuperamos el token guardado en el LocalStorage o en el AuthService
    const token =
      localStorage.getItem('tech_token') || sessionStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Paso 1: Limpiamos el carrito en la base de datos para evitar conflictos
    return this.http.delete<any>(`${this.CARRITO_URL}/limpiar`, { headers }).pipe(
      switchMap(() => {
        // Paso 2: Creamos un arreglo de peticiones POST para cada producto
        const peticiones = items.map(item =>
          this.http.post<any>(`${this.CARRITO_URL}/agregar`, {
            productoId: item.producto.id,
            cantidad: item.cantidad
          }, { headers })
        );

        // Paso 3: Ejecutamos todas las peticiones en paralelo de manera segura
        return forkJoin(peticiones);
      })
    );
  }

  public total = computed(() => {
    return this.itemsSignal().reduce(
      (acc, item) => acc + item.producto.precio * item.cantidad,
      0,
    );
  });

  public cantidadItems = computed(() => {
    return this.itemsSignal().reduce((acc, item) => acc + item.cantidad, 0);
  });

  public get items() {
    return this.itemsSignal.asReadonly();
  }

  agregarProducto(producto: Producto) {
    this.itemsSignal.update((items) => {
      const itemExistente = items.find((i) => i.producto.id === producto.id);

      if (itemExistente) {
        return items.map((i) =>
          i.producto.id === producto.id
            ? {
                ...i,
                cantidad: i.cantidad + 1,
                subtotal: (i.cantidad + 1) * i.producto.precio,
              }
            : i,
        );
      }
      return [...items, { producto, cantidad: 1, subtotal: producto.precio }];
    });
  }

  // 3. NUEVA MEJORA: Modificar cantidad (+ o -) directamente
  actualizarCantidad(productoId: number, cambio: number) {
    this.itemsSignal.update((items) => {
      return items.map((item) => {
        if (item.producto.id === productoId) {
          const nuevaCantidad = item.cantidad + cambio;
          // Validar que no baje de 1 ni supere el stock disponible
          const cantidadFinal = Math.max(
            1,
            Math.min(nuevaCantidad, item.producto.stock),
          );

          return {
            ...item,
            cantidad: cantidadFinal,
            subtotal: cantidadFinal * item.producto.precio,
          };
        }
        return item;
      });
    });
  }

  eliminarItem(productoId: number) {
    this.itemsSignal.update((items) =>
      items.filter((i) => i.producto.id !== productoId),
    );
  }

  limpiarCarrito() {
    this.itemsSignal.set([]);
    localStorage.removeItem('techstore_cart');
  }
}
