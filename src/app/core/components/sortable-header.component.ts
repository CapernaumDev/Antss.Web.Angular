import { Component, Input, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SortableDirective } from '@app/core/directives/sortable.directive';

@Component({
  selector: '[sortHeader]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sort-col">
      <ng-content></ng-content>
      <div
        *ngrxLet="sortable.sortChange$ as sort"
        data-test-id="showSortOrder"
        [ngClass]="{
          arrow: true,
          hide: sort.column !== ref || sort.direction === null,
          asc: sort.column === ref && sort.direction === 'asc',
          desc: sort.column === ref && sort.direction === 'desc'
        }"
      >
        🡡
      </div>
    </div>
  `,
  styles: [
    `
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
    `
  ]
})
export class SortableHeaderComponent {
  @Input() ref!: string;

  @HostListener('click')
  sort() {
    this.sortable.sort(this.ref);
  }

  constructor(public sortable: SortableDirective) {}
}
