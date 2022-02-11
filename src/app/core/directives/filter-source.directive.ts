import { Directive, EventEmitter, Output } from "@angular/core";
import { SetFilterEvent } from "../interfaces/set-filter-event";

@Directive({
    selector: "[filterSource]"
  })
  export class FilterSourceDirective {
    active!: string;
  
    @Output() filterChange = new EventEmitter<SetFilterEvent>();
  
    filter(filterTerm: string | null) {
      if (!filterTerm) filterTerm = '';

      this.filterChange.emit({
        filterTerm
      });
    }
  }