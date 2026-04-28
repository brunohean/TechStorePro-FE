export interface ImagenProducto {
  id?: number;
  nombreArchivo: string;
  urlPublica: string;
  providerId: string;
  storageProvider: string;
  formato: string;
  esPrincipal: boolean;
}

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  activo?: boolean;
  imagenPrincipalUrl?: string; // <- El nuevo atributo plano que viene del DTO
}
