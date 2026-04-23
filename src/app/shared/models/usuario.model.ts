export interface Usuario {
  id?: number;
  username: string;
  email: string;
  roles: string[];
  token?: string; // Para persistencia en LocalStorage
}