import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';

import { BoardColumn } from '@app/core/models/board-column';
import { TicketListItem } from '@app/core/models/ticket/ticket-list-item';
import { Observable } from 'rxjs';
import { TicketBoardDataSource } from './board-data-source';
import { FilterSourceDirective } from '@app/core/directives/filter-source.directive';
import { FilterInputComponent } from '@app/core/components/filter-input.component';
import { AppState } from '@app/core/store/app.state';
import { loadTicketBoardRequested, ticketStatusUpdatedByUser } from '@app/core/store/actions-ui';
import { selectTicketBoard } from '@app/core/store/selectors';

@Component({
  selector: 'app-ticket-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TicketBoardComponent {
  boardDataSource = new TicketBoardDataSource([]);
  board$: Observable<BoardColumn<TicketListItem>[]> = this.boardDataSource.data$;
  recordCount$: Observable<number> = this.boardDataSource.recordCount$;
  filterTerm!: string;

  @ViewChild(FilterSourceDirective) filterSource!: FilterSourceDirective;
  @ViewChild('filterElement') filterElement!: FilterInputComponent;

  constructor(private store: Store<AppState>){
    this.store.dispatch(loadTicketBoardRequested({ includeClosed: false })); 
    this.boardDataSource.setDataSource(this.store.select(selectTicketBoard));  
  }

  public drop(event: CdkDragDrop<BoardColumn<TicketListItem>>): void {
    if (event.previousContainer === event.container) return;

    let ticket = event.previousContainer.data.items[event.previousIndex];
    let newTicketStatusId = event.container.data.id;
    let newTicketStatus = event.container.data.title;

    this.store.dispatch(ticketStatusUpdatedByUser({ 
      ticket: {...ticket, ticketStatus: newTicketStatus}, 
      boardColumnIndex: event.currentIndex,
      newTicketStatusId: newTicketStatusId
    }));
  }

  trackTicketBy(index: number, ticket: TicketListItem): number {
    return ticket.id;
  }

  trackColumnBy(index: number, boardColumn: BoardColumn<TicketListItem>): number {
    return boardColumn.id;
  }

  reload(event: Event) {
    let target = event.target as HTMLInputElement;
    this.store.dispatch(loadTicketBoardRequested({ includeClosed: target.checked }))
  }

  ngAfterViewInit() {
    this.boardDataSource.filterSource = this.filterSource;
    this.filterSource.filterChange
      .subscribe((setFilterEvent) => { 
        this.filterTerm = setFilterEvent.filterTerm || '';
      });    
  }

  ngOnDestroy() {
    this.boardDataSource.destroy();
  }
}
