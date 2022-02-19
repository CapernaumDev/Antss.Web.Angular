import { Directive, EventEmitter, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { SortChangeEvent, SortDirection } from '../interfaces/sort-change-event';

@Directive({
  selector: '[sortable]'
})
export class SortableDirective implements OnDestroy {
  private subscription!: Subscription;
  private sortChange = new BehaviorSubject<SortChangeEvent>({ column: '', direction: null });
  sortChange$ = this.sortChange.asObservable();

  @Output() sortChangeEvent = new EventEmitter<SortChangeEvent>();

  sort(column: string) {
    this.subscription = this.sortChange$.pipe(take(1)).subscribe((sortChange) => {
      let nextColumn = sortChange.column;
      if (sortChange.column !== column) {
        nextColumn = column;
      }

      let nextDirection: SortDirection = null;
      if (sortChange.direction === null) {
        nextDirection = 'asc';
      } else if (sortChange.direction === 'asc') {
        nextDirection = 'desc';
      }

      const nextSortChange = {
        column: nextColumn,
        direction: nextDirection
      } as SortChangeEvent;

      this.sortChangeEvent.emit(nextSortChange);
      this.sortChange.next(nextSortChange);
    });
  }

  ngOnDestroy(): void {
    if (!this.subscription.closed) this.subscription.unsubscribe();
  }
}
