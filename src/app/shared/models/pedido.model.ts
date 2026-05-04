export interface DetallePedido {
  id?: number;
  productoId: number;
  productoNombre: string; // Cambiado para matchear con el DTO de Java
  cantidad: number;
  precioUnitario: number;
  subtotal: number; // Nuevo: Cantidad * Precio
}

export interface Pedido {
  id?: number;
  usuarioId?: number; // El backend suele obtenerlo del JWT, puede ser opcional al enviar
  fecha?: string;
  total: number;
  estado:
    | 'PENDIENTE'
    | 'PREPARANDO'
    | 'PAGADO'
    | 'ENVIADO'
    | 'ENTREGADO'
    | 'CANCELADO';
  detalles: DetallePedido[];

  // -- ATRIBUTOS OBLIGATORIOS PARA EL CHECKOUT --
  clienteNombre: string;
  celular: string;
  direccion: string;
}