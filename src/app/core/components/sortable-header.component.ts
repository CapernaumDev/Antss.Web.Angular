import { Component, Input, HostListener, ChangeDetectionStrategy } from "@angular/core";
import { SortableDirective } from "@app/core/directives/sortable.directive";

@Component({
  selector: "[sortHeader]",
  template: `
    <div class="sort-col">
      <ng-content></ng-content>
      <div [ngClass]="{
          arrow: true,
          hide: sortable?.active !== ref || sortable?.direction === null,
          asc: sortable?.active === ref && sortable?.direction === 'asc',
          desc: sortable?.active === ref && sortable?.direction === 'desc'
        }">🡡</div>
    </div>
  `,
  styles: [`
      .sort-col {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .arrow {
        font-size: 14px;
      }
      .arrow.hide {
        opacity: 0;
      }
      .arrow.desc {
        transform: rotate(180deg);
      }
  `],
})

export class SortableHeaderComponent {
  @Input() ref!: string;

  @HostListener("click")
  sort() {
    this.sortable.sort(this.ref);
  }

  constructor(public sortable: SortableDirective) {}
}