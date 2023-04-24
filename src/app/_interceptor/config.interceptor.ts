import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToasterService } from '../_services/helpers/toaster.service';

@Injectable()
export class ConfigInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toaster: ToasterService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          switch (error.status) {
            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: error.error },
              };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;

            case 404:
              this.router.navigateByUrl('/not-found');
              break;

            case 401:
              this.toaster.showError({
                message: 'Unauthorised',
                title: error.status.toString(),
              });
              break;

            case 400:
              debugger;
              if (error.error.errors) {
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  modelStateErrors.push(error.error.errors[key]);
                }
                throw modelStateErrors;
              } else {
                this.toaster.showError({
                  message: error.error,
                  title: error?.status?.toString(),
                });
              }
              break;

            default:
              this.toaster.showError();
              console.log(error);
              break;
          }
        }
        throw error;
      })
    );
  }
}
