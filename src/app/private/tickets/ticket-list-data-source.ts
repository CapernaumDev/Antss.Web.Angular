import { SetFilterEvent } from "../../core/interfaces/set-filter-event";
import { SortChangeEvent } from "../../core/interfaces/sort-change-event";
import { TicketListItem } from "../../core/models/ticket/ticket-list-item";
import { DataSource } from "../../core/data-source";

export class TicketListDataSource extends DataSource<TicketListItem> {
    sortLogic({ column, direction }: SortChangeEvent, data: TicketListItem[]) {
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
      filterLogic({ filterTerm }: SetFilterEvent, data: TicketListItem[]) {
        let filterTermAsNumber = parseInt(filterTerm);

        if (isNaN(filterTermAsNumber)) {
          const term = filterTerm.toLowerCase();

          return data.filter(x => {
            return x.assignedTo?.toLowerCase().includes(term)
              || x.raisedBy.toLowerCase().includes(term)
              || x.ticketStatus.toLowerCase().includes(term)
              || x.title.toLowerCase().includes(term)
          });
        } else {
          return data.filter(x => x.id === filterTermAsNumber);
        }
      }
}
