import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';

import { TicketListItem } from '@app/core/models/ticket/ticket-list-item';
import { Store } from '@ngrx/store';
import { ticketAnimationPlayed } from '@app/core/store/actions-system';
import confirmationHighlightAnimation from '@app/core/animations/confirmation-highlight.animation';
import { VisibilityService } from '@app/core/services/visibility.service';

@Component({
  selector: 'div[board-item]',
  templateUrl: './board-item.component.html',
  styleUrls: ['./board-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: confirmationHighlightAnimation,
  providers: [VisibilityService]
})
export class TicketBoardItemComponent {
  constructor(private store: Store, private visibilityService: VisibilityService, private host: ElementRef) {}

  inSight$ = this.visibilityService.elementInSight(this.host);
  @Input() ticket!: TicketListItem;
  @Input() filterTerm!: string;

  animationComplete(animation: string | null) {
    if (animation) this.store.dispatch(ticketAnimationPlayed({ ticketId: this.ticket.id }));
  }
}
