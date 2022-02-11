import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { AppState } from '@app/core/store/app.state';
import { Store } from '@ngrx/store';
import { selectCurrentUser, selectIsSigningIn } from '@app/core/store/selectors';
import { Observable } from 'rxjs';
import { CurrentUser } from '@app/core/models/user/current-user';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  animations: [
    trigger('fade', [ 
      transition('void => *', [
        style({ opacity: 0 }), 
        animate(500, style({opacity: 1}))
      ]) 
    ])
  ]
})
export class HomeComponent implements OnInit {
  public isSigningIn$: Observable<boolean>;
  public currentUser$: Observable<CurrentUser | null>;

  constructor(private store: Store<AppState>, private http: HttpClient) {
    this.isSigningIn$ = this.store.select(selectIsSigningIn);
    this.currentUser$ = this.store.select(selectCurrentUser);
   }

  ngOnInit() {
  }
  
  sendMessage() {
    this.http.get('https://localhost:7210/api/hub')
    .subscribe(res => {
      console.log(res);
    })
  }
}
