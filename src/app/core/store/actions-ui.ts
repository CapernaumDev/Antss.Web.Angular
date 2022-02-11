import { createAction, props } from '@ngrx/store';
import { LoginCredential } from '../models/login-credential';
import { CreateTicket } from '../models/ticket/create-ticket';
import { TicketListItem } from '../models/ticket/ticket-list-item';
import { User } from '../models/user/user';

export const loginWithCredentials = createAction(
    '[Login Page] Login',
    props<{ loginCredential: LoginCredential }>()
);

export const logoutUserInitiated = createAction(
    '[Nav Menu] Logout'
);

export const loadTicketsRequested = createAction(
    '[Ticket List] Load Tickets Requested',
    props<{ includeClosed: boolean }>()
);

export const ticketStatusUpdatedByUser = createAction(
    '[Ticket Board] Ticket Status Updated',
    props<{ 
        ticket: TicketListItem, 
        boardColumnIndex: number | null,
        newTicketStatusId: number
     }>()
);

export const loadTicketBoardRequested = createAction(
    '[Ticket Board] Load Ticket Board Requested',
    props<{ includeClosed: boolean }>()
);

export const loadUserListRequested = createAction(
    '[User List] Load User List Requested'
);

export const createTicketRequested = createAction(
    '[Create Ticket Form] Create Ticket Requested',
    props<{ ticket: CreateTicket }>()
);

export const loadUserRequested = createAction(
    '[User Form] Load User Requested',
    props<{ userId: number }>()
);

export const createUserRequested = createAction(
    '[User Form] Create User Requested',
    props<{ user: User }>()
);

export const updateUserRequested = createAction(
    '[User Form] Update User Requested',
    props<{ user: User }>()
);