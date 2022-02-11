import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import { logoutOnServerUnauthorised } from './store/actions-system';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private store: Store<AppState>) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
              this.store.dispatch(logoutOnServerUnauthorised());
            }

            const error = err?.error?.message || err.statusText;
            return throwError(error);
        }))
    }
}
