import { Directive, EventEmitter, Output } from "@angular/core";
import { SortChangeEvent, SortDirection } from "../interfaces/sort-change-event";

@Directive({
    selector: "[sortable]"
  })
  export class SortableDirective {
    active!: string;
    direction!: SortDirection | null;
  
    @Output() sortChange = new EventEmitter<SortChangeEvent>();
  
    sort(column: string) {
      let direction = this.direction;
      
      if (this.active !== column) {
        this.direction = null;
        this.active = column;
      }
      
      if (this.direction === null) {
        direction = "asc";
      } 
      
      else if (this.direction === "asc") {
        direction = "desc";
      }
      
      else if (this.direction === "desc") {
        direction = null;
      }
      
      this.sortChange.emit({
        column,
        direction
      });
      this.direction = direction;
    }
  }