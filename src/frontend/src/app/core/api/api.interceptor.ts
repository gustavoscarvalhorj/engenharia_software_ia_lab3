import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, throwError, timeout } from 'rxjs';

const TRANSIENT_STATUSES = new Set([0, 502, 503, 504]);

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const correlatedRequest = request.clone({
    setHeaders: { 'x-correlation-id': crypto.randomUUID() },
  });

  return next(correlatedRequest).pipe(
    timeout(5_000),
    retry({
      count: 1,
      delay: (error: unknown) => {
        const canRetry =
          request.method === 'GET' &&
          error instanceof HttpErrorResponse &&
          TRANSIENT_STATUSES.has(error.status);
        return canRetry ? new Promise((resolve) => setTimeout(resolve, 150)) : throwError(() => error);
      },
    }),
  );
};
