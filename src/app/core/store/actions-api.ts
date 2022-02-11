import { createAction, props } from '@ngrx/store';
import { BoardColumn } from '../models/board-column';
import { LoginResult } from '../models/login-result';
import { TicketListItem } from '../models/ticket/ticket-list-item';
import { User } from '../models/user/user';
import { UserListItem } from '../models/user/user-list-item';

export const loginSuccess = createAction(
    '[Login API] Login Success',
    props<{ loginResult: LoginResult }>()
);

export const loginFailure = createAction(
    '[Login API] Login Failure',
    props<{ message: string }>()
);

export const loadTicketsSuccess = createAction(
    '[Ticket API] Load Tickets Success',
    props<{ tickets: TicketListItem[] }>()
);

export const loadTicketsFailure = createAction(
    '[Ticket API] Load Tickets Failure'
);

export const loadTicketBoardSuccess = createAction(
    '[Ticket API] Load Ticket Board Success',
    props<{ board: BoardColumn<TicketListItem>[] }>()
);

export const loadTicketBoardFailure = createAction(
    '[Ticket API] Load Ticket Board Failure'
);

export const createTicketSuccess = createAction(
    '[Ticket API] Create Ticket Success'
)

export const createTicketFailure = createAction(
    '[Ticket API] Create Ticket Failure'
)

export const updateTicketStatusSuccess = createAction(
    '[Ticket API] Update Ticket Status Success'
);

export const updateTicketStatusFailure = createAction(
    '[Ticket API] Update Ticket Status Failed'
);

export const loadUserListSuccess = createAction(
    '[User API] Load User List Success',
    props<{ users: UserListItem[] }>()
);

export const loadUserListFailure = createAction(
    '[User API] Load User List Failure'
);

export const loadUserSuccess = createAction(
    '[User API] Load User Success',
    props<{ user: User }>()
);

export const loadUserFailure = createAction(
    '[User API] Load User Failed'
);

export const createUserSuccess = createAction(
    '[User API] Create User Success'
);

export const createUserFailure = createAction(
    '[User API] Create User Failed'
);

export const updateUserSuccess = createAction(
    '[User API] Update User Success'
);

export const updateUserFailure = createAction(
    '[User API] Update User Failed'
);

