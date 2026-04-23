export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenes: string[]; // Arreglo de URLs de Cloudinary
  activo: boolean;
}