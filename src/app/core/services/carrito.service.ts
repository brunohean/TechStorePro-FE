import { computed, effect, Injectable, signal } from '@angular/core';
import { CarritoItem } from '../../shared/models/carrito.model';
import { Producto } from '../../shared/models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  // Nuestro estado global reactivo usando Signals
  private itemsSignal = signal<CarritoItem[]>([]);

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
            ? { ...i, cantidad: i.cantidad + 1 }
            : i,
        );
      }
      return [...items, { producto, cantidad: 1 }];
    });
  }

  // 3. NUEVA MEJORA: Modificar cantidad (+ o -) directamente
  actualizarCantidad(productoId: number, cambio: number) {
    this.itemsSignal.update((items) => {
      return items.map((item) => {
        if (item.producto.id === productoId) {
          const nuevaCantidad = item.cantidad + cambio;
          // Evitamos que la cantidad sea menor a 1
          return { ...item, cantidad: Math.max(1, nuevaCantidad) };
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
