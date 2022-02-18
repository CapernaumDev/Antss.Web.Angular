import { Component, Input, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SortableDirective } from '@app/core/directives/sortable.directive';

@Component({
  selector: '[sortHeader]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sort-col">
      <ng-content></ng-content>
      <div
        data-test-id="showSortOrder"
        [ngClass]="{
          arrow: true,
          hide: (sortable.active$ | ngrxPush) !== ref || (sortable.direction$ | ngrxPush) === null,
          asc: (sortable.active$ | ngrxPush) === ref && (sortable.direction$ | ngrxPush) === 'asc',
          desc: (sortable.active$ | ngrxPush) === ref && (sortable.direction$ | ngrxPush) === 'desc'
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
