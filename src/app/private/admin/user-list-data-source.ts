import { SetFilterEvent } from "../../core/interfaces/set-filter-event";
import { SortChangeEvent } from "../../core/interfaces/sort-change-event";
import { UserListItem } from "../../core/models/user/user-list-item";
import { DataSource } from "../../core/data-source";

export class UserListDataSource extends DataSource<UserListItem> {
  sortLogic({ column, direction }: SortChangeEvent, data: UserListItem[]) {
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
  filterLogic({ filterTerm }: SetFilterEvent, data: UserListItem[]) {
    const term = filterTerm.toLowerCase();

    return data.filter(x => {
      return x.firstName.toLowerCase().includes(term)
        || x.lastName.toLowerCase().includes(term)
        || x.officeName.toLowerCase().includes(term)
        || x.userType.toLowerCase().includes(term)
    });
  }
}
