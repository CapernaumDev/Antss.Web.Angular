import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketListItem } from '@core/models/ticket/ticket-list-item';
import { SortableDirective } from '@app/core/directives/sortable.directive';
import { TicketListDataSource } from './ticket-list-data-source';
import { AppState } from '@app/core/store/app.state';
import { Store } from '@ngrx/store';
import { loadTicketsRequested } from '@app/core/store/actions-ui';
import { selectTicketList } from '@app/core/store/selectors';
import { ticketAnimationPlayed } from '@app/core/store/actions-system';
import confirmationHighlightAnimation from '@app/core/animations/confirmation-highlight.animation';

@Component({
  selector: 'ticket-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-list.component.html',
  animations: confirmationHighlightAnimation,
  providers: [TicketListDataSource]
})
export class TicketListComponent {
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

  animationComplete(animation: string | null, ticketId: number) {
    if (animation) this.store.dispatch(ticketAnimationPlayed({ ticketId: ticketId }));
  }

  ngOnDestroy() {
    this.ticketsDataSource.destroy();
  }
}
