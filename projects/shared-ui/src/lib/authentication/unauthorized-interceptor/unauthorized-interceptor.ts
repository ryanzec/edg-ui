import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthenticationManager } from '../authentication-manager/authentication-manager';
import { AUTHENTICATION_API_URL } from '../authentication-api/authentication-api';

export const unauthorizedInterceptor: HttpInterceptorFn = (request, next) => {
  const authenticationManager = inject(AuthenticationManager);
  const router = inject(Router);
  const baseUrl = inject(AUTHENTICATION_API_URL);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && request.url.startsWith(baseUrl)) {
        authenticationManager.logout();

        router.navigate(['/login']);
      }

      // Re-throw the error for other handling
      return throwError(() => error);
    })
  );
};
