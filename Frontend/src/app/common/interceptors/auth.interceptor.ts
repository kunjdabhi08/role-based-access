import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../modules/auth/services/Auth/auth-service.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authToken = JSON.parse(sessionStorage.getItem('token'));

  const commonService = inject(CommonService)
  const authService = inject(AuthServiceService)

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });

  return next(authReq).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        switch (err.status) {
          case 400:
          case 404:
          case 403:
            commonService.openSnackBar(err.error.message)
            break;
          case 401:
            commonService.openSnackBar(err.error.message)
            authService.logout();
            break;
          default:
            commonService.openSnackBar("Something went wrong! Please try after few minutes")
            break;
        }
      }
      return throwError(() => err);
    })
  );;
};
