export interface DetallePedido {
  id?: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
}

export interface Pedido {
  id?: number;
  usuarioId: number;
  fecha: string;
  total: number;
    estado: 'PENDIENTE' | 'PREPARANDO' | 'PAGADO' |
    'ENVIADO' | 'ENTREGADO' | 'CANCELADO'; // Estados estrictos
  detalles: DetallePedido[];
}