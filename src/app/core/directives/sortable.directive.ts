import { Directive, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, pipe, shareReplay, take, tap, withLatestFrom } from 'rxjs';
import { SortChangeEvent, SortDirection } from '../interfaces/sort-change-event';

@Directive({
  selector: '[sortable]'
})
export class SortableDirective {
  private active = new BehaviorSubject<string>('');
  private direction = new BehaviorSubject<SortDirection | null>(null);
  active$ = this.active.pipe(shareReplay(1));
  direction$ = this.direction.pipe(shareReplay(1));

  @Output() sortChange = new EventEmitter<SortChangeEvent>();

  sort(column: string) {
    this.active$.pipe(withLatestFrom(this.direction$), take(1)).subscribe(([active, direction]) => {
      if (active !== column) {
        this.active.next(column);
      }

      let nextDirection: SortDirection = null;
      if (direction === null) {
        nextDirection = 'asc';
      } else if (direction === 'asc') {
        nextDirection = 'desc';
      }

      this.sortChange.emit({
        column,
        direction: nextDirection
      });

      this.direction.next(nextDirection);
    });
  }
}
