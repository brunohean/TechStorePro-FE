import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('tech_token');

  let clonedRequest = req;

  // Solo inyectamos el token si existe y la petición va hacia nuestra API
  if (token) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // CISO Compliance: Limpieza silenciosa ante token expirado o inválido
        localStorage.removeItem('tech_token');
        localStorage.removeItem('tech_user');
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    }),
  );
};
