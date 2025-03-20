import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = environment.apiKey;
  
  if (apiKey) {
    const modifiedReq = req.clone({
      headers: req.headers.set('x-api-key', apiKey)
    });
    return next(modifiedReq);
  }
  
  return next(req);
}; 