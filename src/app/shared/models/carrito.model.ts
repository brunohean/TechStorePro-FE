import { Producto } from './producto.model';

export interface CarritoItem {
  id?: number;
  producto: Producto;
  cantidad: number;
}

export interface Carrito {
  id?: number;
  usuarioId: number;
  items: CarritoItem[];
  total: number;
}
