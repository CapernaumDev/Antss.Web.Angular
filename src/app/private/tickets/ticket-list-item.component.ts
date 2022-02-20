import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AppState } from '@app/core/store/app.state';
import { Store } from '@ngrx/store';
import { ticketAnimationPlayed } from '@app/core/store/actions-system';
import confirmationHighlightAnimation from '@app/core/animations/confirmation-highlight.animation';
import { VisibilityService } from '@app/core/services/visibility.service';
import { TicketListItem } from '@app/core/models/ticket/ticket-list-item';

@Component({
  selector: 'tr[ticket-list-item]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-list-item.component.html',
  animations: confirmationHighlightAnimation,
  providers: [VisibilityService]
})
export class TicketListItemComponent {
  inSight$ = this.visibilityService.elementInSight(this.host);

  @Input() ticket!: TicketListItem;
  @Input() filterTerm!: string;

  constructor(private store: Store<AppState>, private visibilityService: VisibilityService, private host: ElementRef) {}

  animationComplete(animation: string | null, ticketId: number) {
    if (animation) this.store.dispatch(ticketAnimationPlayed({ ticketId: ticketId }));
  }
}
