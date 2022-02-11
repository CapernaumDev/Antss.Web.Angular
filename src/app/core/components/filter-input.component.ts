import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { FilterSourceDirective } from "@app/core/directives/filter-source.directive";
import { debounceTime, distinctUntilChanged, Subject, Subscription } from "rxjs";

@Component({
  selector: "[filterInput]",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input (input)="filterUpdated($event)"/>
  `
})

export class FilterInputComponent implements OnInit {
  public currentValue: string = '';
  private filterTerm$ = new Subject<string>();
  private subscription!: Subscription;

  filterUpdated(event: Event) {
    this.filterTerm$.next((event?.currentTarget as HTMLInputElement)?.value || '');
  }

  constructor(public filter: FilterSourceDirective) { }

  ngOnInit(): void {
    this.subscription = this.filterTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((filterValue: string) => {
      this.filter.filter(filterValue);
      this.currentValue = filterValue;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
