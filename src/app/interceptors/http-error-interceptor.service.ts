import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptorService {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log(error);
        let errorMessage = '';
        if (error.status && error.error.message) {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
          console.error(errorMessage);
          throw Error(error.error.message);
        }else{
          console.log(error);
          throw new Error("Something went wrong !");
        }
      })
    );
  }

}
