import { Producto } from './producto.model';

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

export interface Carrito {
  id?: number;
  usuarioId: number;
  items: CarritoItem[];
  total: number;
}
