import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable, take } from 'rxjs';
import { setAfterLoginRedirect } from './store/actions-system';
import { AppState } from './store/app.state';
import { selectCurrentUser } from './store/selectors';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store<AppState>
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable<boolean>(obs => {
      let routeRole = route.data["role"] as string;
      let redirectAfterLogin = route.url.toString();

      this.store.select(selectCurrentUser).pipe(
        take(1)
      ).subscribe(user => {
        if (!user) {
          this.store.dispatch(setAfterLoginRedirect({ url: redirectAfterLogin }));
          obs.next(false);
          this.router.navigate(['login']);
        } else {
          if (routeRole && routeRole.includes('Admin') && !user.isAdmin) {
            obs.next(false);
            this.router.navigate(['']);
            return;
          }

          obs.next(true);
        }
      })
    });
  }
}
