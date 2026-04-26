import { HttpInterceptorFn } from '@angular/common/http';

/**
 * interceptor that sets `withCredentials: true` on all outgoing http requests
 */
export const httpWithCredentialsInterceptor: HttpInterceptorFn = (request, next) => {
  return next(request.clone({ withCredentials: true }));
};
