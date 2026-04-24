import { computed, Injectable, signal } from '@angular/core';
import { CarritoItem } from '../../shared/models/carrito.model';
import { Producto } from '../../shared/models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  // Nuestro estado global reactivo usando Signals
  private itemsSignal = signal<CarritoItem[]>([]);

  // Propiedades computadas: se actualizan solas cuando itemsSignal cambia
  public total = computed(() => {
    return this.itemsSignal().reduce(
      (acc, item) => acc + item.producto.precio * item.cantidad,
      0,
    );
  });

  public cantidadItems = computed(() => {
    return this.itemsSignal().reduce((acc, item) => acc + item.cantidad, 0);
  });

  // Exponemos los items como solo lectura
  public get items() {
    return this.itemsSignal.asReadonly();
  }

  constructor() {}

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

  eliminarItem(productoId: number) {
    this.itemsSignal.update((items) =>
      items.filter((i) => i.producto.id !== productoId),
    );
  }

  limpiarCarrito() {
    this.itemsSignal.set([]);
  }
}
