import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { UserListItem } from '@app/core/models/user/user-list-item';
import { UserListDataSource } from './user-list-data-source';
import { SortableDirective } from '@app/core/directives/sortable.directive';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/store/app.state';
import { loadUserListRequested } from '@app/core/store/actions-ui';
import { selectUserList } from '@app/core/store/selectors';

@Component({
  selector: 'user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-list.component.html',
  providers: [UserListDataSource]
})
export class UserListComponent implements OnDestroy, AfterViewInit {
  users$: Observable<UserListItem[]> = this.usersDataSource.data$;
  filterTerm$: Observable<string> = this.usersDataSource.filterTerm$;

  @ViewChild(SortableDirective) sorter!: SortableDirective;

  constructor(private store: Store<AppState>, public usersDataSource: UserListDataSource) {
    this.store.dispatch(loadUserListRequested());
    this.usersDataSource.setDataSource(this.store.select(selectUserList));
  }

  ngAfterViewInit() {
    this.usersDataSource.sorter = this.sorter;
  }

  trackUserBy(index: number, user: UserListItem): number {
    return user.id;
  }

  ngOnDestroy() {
    this.usersDataSource.destroy();
  }
}
