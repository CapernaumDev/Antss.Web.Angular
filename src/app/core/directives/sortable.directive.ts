import { Directive, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, shareReplay, tap } from 'rxjs';
import { SortChangeEvent, SortDirection } from '../interfaces/sort-change-event';

@Directive({
  selector: '[sortable]'
})
export class SortableDirective {
  private active = new BehaviorSubject<string>('');
  private direction = new BehaviorSubject<SortDirection | null>(null);
  private lastActive?: string | null;
  private lastDirection?: SortDirection | null;
  active$ = this.active.pipe(
    shareReplay(1),
    tap((x) => (this.lastActive = x))
  );
  direction$ = this.direction.pipe(tap((x) => (this.lastDirection = x)));

  @Output() sortChange = new EventEmitter<SortChangeEvent>();

  sort(column: string) {
    let direction = this.lastDirection as SortDirection;

    //TODO: Sort out this last.. stuff

    if (this.lastActive !== column) {
      this.lastDirection = null;
      this.direction.next(null);
      this.active.next(column);
    }

    if (this.lastDirection === null) {
      direction = 'asc';
    } else if (this.lastDirection === 'asc') {
      direction = 'desc';
    } else if (this.lastDirection === 'desc') {
      direction = null;
    }

    this.sortChange.emit({
      column,
      direction
    });

    this.lastDirection = direction;
    this.lastActive = column;
    this.direction.next(direction);
  }
}
