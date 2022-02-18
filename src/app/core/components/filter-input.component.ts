import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { FilterSourceDirective } from '@app/core/directives/filter-source.directive';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  selector: '[filterInput]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input class="form-control form-control-sm" style="width: 200px; display: inline" (input)="filterUpdated($event)" />
  `
})
export class FilterInputComponent implements OnInit, OnDestroy {
  private filterTerm$ = new Subject<string>();
  private subscription!: Subscription;

  filterUpdated(event: Event) {
    const filterTerm = (event?.currentTarget as HTMLInputElement)?.value || '';
    this.filterTerm$.next(filterTerm);
  }

  constructor(public filter: FilterSourceDirective) {}

  ngOnInit(): void {
    this.subscription = this.filterTerm$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((filterValue: string) => {
        this.filter.filter(filterValue);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
