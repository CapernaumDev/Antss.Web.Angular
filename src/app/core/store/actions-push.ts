import { createAction, props } from '@ngrx/store';
import { AppData } from '../models/app-data';
import { OptionItem } from '../models/option-item';
import { TicketListItem } from '../models/ticket/ticket-list-item';
import { UserListItem } from '../models/user/user-list-item';

export const updateAssignableUsers = createAction(
    '[Server Push] Update Assignable User Options',
    props<{ options: OptionItem[] }>()
)

export const setInitialAppData = createAction(
    '[Server Push] Initial App Data',
    props<{ appData: AppData }>()
)

export const ticketCreated = createAction(
    '[Server Push] Ticket Created',
    props<{ 
        ticket: TicketListItem,
        boardColumnIndex: number | null,
        initiatedByUserId: number
    }>()
);

export const ticketStatusUpdatedByServer = createAction(
    '[Server Push] Ticket Status Updated',
    props<{ 
        ticket: TicketListItem, 
        boardColumnIndex: number | null,
        initiatedByUserId: number
    }>()
);

export const userCreated = createAction(
    '[Server Push] User Created',
    props<{ user: UserListItem }>()
);

export const userUpdated = createAction(
    '[Server Push] User Updated',
    props<{ user: UserListItem }>()
);