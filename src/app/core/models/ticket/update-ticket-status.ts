export class UpdateTicketStatus {
    ticketId: number;
    ticketStatusId: number;
    boardColumnIndex?: number | null;

    constructor(ticketId: number, ticketStatusId: number, boardColumnIndex: number | null) {
        this.ticketId = ticketId;
        this.ticketStatusId = ticketStatusId;
        this.boardColumnIndex = boardColumnIndex;
    }
  }
  