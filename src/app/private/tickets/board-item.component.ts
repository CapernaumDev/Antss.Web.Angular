import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { TicketListItem } from '@app/core/models/ticket/ticket-list-item';
import { Store } from '@ngrx/store';
import { ticketAnimationPlayed } from '@app/core/store/actions-system';
import confirmationHighlightAnimation from '@app/core/animations/confirmation-highlight.animation';

@Component({
  selector: 'div[board-item]',
  templateUrl: './board-item.component.html',
  styleUrls: ['./board-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: confirmationHighlightAnimation
})

export class TicketBoardItemComponent implements OnInit {
  constructor(private store: Store) {
  }

  @Input() ticket!: TicketListItem;
  @Input() filterTerm!: string;

  ngOnInit(): void {
  }

  animationComplete(animation: string | null) {
    if (animation)
      this.store.dispatch(ticketAnimationPlayed({ ticketId: this.ticket.id }));
  }

  ngOnDestroy() {
  }
}
