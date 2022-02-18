import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CurrentUser } from '../models/user/current-user';
import { AppState } from '../store/app.state';
import { logoutUserInitiated } from '@core/store/actions-ui';
import { selectCurrentUser } from '../store/selectors';

@Component({
  selector: 'app-nav-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  public currentUser$: Observable<CurrentUser | null>;
  public faUserCircle = faUserCircle;
  public faEnvelope = faEnvelope;

  isExpanded = false;

  constructor(private store: Store<AppState>) {
    this.currentUser$ = this.store.select(selectCurrentUser);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    this.store.dispatch(logoutUserInitiated());
  }
}
