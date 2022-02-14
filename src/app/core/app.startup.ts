import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "./store/app.state";
import { loginWithToken, setPreviousUrl } from './store/actions-system';
import { LoginCredential } from "./models/login-credential";
import { Router, RoutesRecognized } from "@angular/router";
import { filter, pairwise } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppStartup {
  constructor(private store: Store<AppState>, private router: Router) {
  }

  startup() {
    let token = localStorage["access-token"]
    if (!token || token == 'undefined' || token == 'null') return;

    let loginCredential = new LoginCredential();
    loginCredential.accessToken = token;
    this.store.dispatch(loginWithToken({loginCredential: loginCredential }));

    this.router.events
      .pipe(filter((event: any) => event instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        this.store.dispatch(setPreviousUrl({ url: events[0].urlAfterRedirects }));
      });
  }
}
