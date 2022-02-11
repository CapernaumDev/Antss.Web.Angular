import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { UserListItem } from '@app/core/models/user/user-list-item';
import { UserListDataSource } from './user-list-data-source';
import { SortableDirective } from '@app/core/directives/sortable.directive';
import { FilterSourceDirective } from '@app/core/directives/filter-source.directive';
import { FilterInputComponent } from '@app/core/components/filter-input.component';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/store/app.state';
import { loadUserListRequested } from '@app/core/store/actions-ui';
import { selectUserList } from '@app/core/store/selectors';

@Component({
  selector: 'user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-list.component.html',
})

export class UserListComponent {
  usersDataSource = new UserListDataSource([]);
  users$: Observable<UserListItem[]> = this.usersDataSource.data$;
  recordCount$: Observable<number> = this.usersDataSource.recordCount$;

  @ViewChild(SortableDirective) sorter!: SortableDirective;
  @ViewChild(FilterSourceDirective) filterSource!: FilterSourceDirective;
  @ViewChild('filterElement') filterElement!: FilterInputComponent;

  constructor(private store: Store<AppState>) { 
    this.store.dispatch(loadUserListRequested()); 
    this.usersDataSource.setDataSource(this.store.select(selectUserList)); 
  }

  ngAfterViewInit() {
    this.usersDataSource.sorter = this.sorter;
    this.usersDataSource.filterSource = this.filterSource;
  }

  trackUserBy(index: number, user: UserListItem): number {
    return user.id;
  }

  ngOnDestroy() {
    this.usersDataSource.destroy();
  }
}
