import { SetFilterEvent } from "../../core/interfaces/set-filter-event";
import { SortChangeEvent } from "../../core/interfaces/sort-change-event";
import { TicketListItem } from "../../core/models/ticket/ticket-list-item";
import { DataSource } from "../../core/data-source";
import { BoardColumn } from "@app/core/models/board-column";
import { Subject, Subscription } from "rxjs";

export class TicketBoardDataSource extends DataSource<BoardColumn<TicketListItem>> {
  private ticketCount = new Subject<number>();
  private subscriptions: Subscription[] = [];
  recordCount$ = this.ticketCount.asObservable();

  sortLogic({ column, direction }: SortChangeEvent, data: BoardColumn<TicketListItem>[]) {
    let sorted = data;
    if (direction === null) {
      return sorted;
    }
    switch (column) {
      // can provide custom sorting logic by column or fall through to default implementation
      default:
        return super.sort(data, column, direction);
    }
  }

  filterLogic({ filterTerm }: SetFilterEvent, data: BoardColumn<TicketListItem>[]) {
    let filterTermAsNumber = parseInt(filterTerm);
    let result: BoardColumn<TicketListItem>[] = [];

    if (isNaN(filterTermAsNumber)) {
      const term = filterTerm.toLowerCase();

      result = data.map(boardColumn => {
        boardColumn = Object.assign({}, boardColumn);
        boardColumn.items = boardColumn.items.filter(ticket => ticket.title.toLowerCase().includes(term))
        return boardColumn;
      });
    } else {
      result = data.map(boardColumn => {
        boardColumn = Object.assign({}, boardColumn);
        boardColumn.items = boardColumn.items.filter(ticket => ticket.id == filterTermAsNumber)
        return boardColumn;
      });
    }

    this.setTicketCount(result);
    return result;
  }

  destroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
    super.destroy();
  }

  protected onDataUpdated(data: BoardColumn<TicketListItem>[]) {
    this.setTicketCount(data);
  }

  private setTicketCount(data: BoardColumn<TicketListItem>[]) {
    let count = 0;

    data.forEach(x => {
      count += x.items.length;
    });

    this.ticketCount.next(count);
  }
}
