import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../shared/models/usuario.model';
import { tap, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = `${environment.apiUrl}/auth`;

  // Estado reactivo del usuario
  private currentUserSignal = signal<Usuario | null>(
    this.getUsuarioDesdeStorage(),
  );

  // Selectores públicos
  public currentUser = this.currentUserSignal.asReadonly();
  public isAuthenticated = computed(() => !!this.currentUserSignal());
  public isAdmin = computed(
    () => this.currentUserSignal()?.roles.includes('ROLE_ADMIN') ?? false,
  );

  login(credentials: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/login`, credentials).pipe(
      tap((user) => {
        if (user && user.token) {
          localStorage.setItem('tech_token', user.token);
          localStorage.setItem('tech_user', JSON.stringify(user));
          this.currentUserSignal.set(user);
        }
      }),
    );
  }

  logout() {
    localStorage.removeItem('tech_token');
    localStorage.removeItem('tech_user');
    this.currentUserSignal.set(null);
    this.router.navigate(['/catalog']);
  }

  private getUsuarioDesdeStorage(): Usuario | null {
    const userJson = localStorage.getItem('tech_user');
    return userJson ? JSON.parse(userJson) : null;
  }
}
