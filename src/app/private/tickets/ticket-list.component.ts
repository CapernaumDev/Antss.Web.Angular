import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketListItem } from '@core/models/ticket/ticket-list-item';
import { SortableDirective } from '@app/core/directives/sortable.directive';
import { TicketListDataSource } from './ticket-list-data-source';
import { AppState } from '@app/core/store/app.state';
import { Store } from '@ngrx/store';
import { loadTicketsRequested } from '@app/core/store/actions-ui';
import { selectTicketList } from '@app/core/store/selectors';

@Component({
  selector: 'ticket-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-list.component.html',
  providers: [TicketListDataSource]
})
export class TicketListComponent implements AfterViewInit, OnDestroy {
  tickets$: Observable<TicketListItem[]> = this.ticketsDataSource.data$;
  filterTerm$: Observable<string> = this.ticketsDataSource.filterTerm$;

  @ViewChild(SortableDirective) sorter!: SortableDirective;

  constructor(private store: Store<AppState>, public ticketsDataSource: TicketListDataSource) {
    this.store.dispatch(loadTicketsRequested({ includeClosed: false }));
    this.ticketsDataSource.setDataSource(this.store.select(selectTicketList));
  }

  ngAfterViewInit() {
    this.ticketsDataSource.sorter = this.sorter;
  }

  trackTicketBy(index: number, ticket: TicketListItem): number {
    return ticket.id;
  }

  reload(event: Event) {
    let target = event.target as HTMLInputElement;
    this.store.dispatch(loadTicketsRequested({ includeClosed: target.checked }));
  }

  ngOnDestroy() {
    this.ticketsDataSource.destroy();
  }
}
