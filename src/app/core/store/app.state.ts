import { BoardColumn } from "../models/board-column";
import { OptionItem } from "../models/option-item";
import { TicketListItem } from "../models/ticket/ticket-list-item";
import { CurrentUser } from "../models/user/current-user";
import { User } from "../models/user/user";
import { UserListItem } from "../models/user/user-list-item";

export interface AppState {
    currentUser: CurrentUser | null;
    status: 'pending' | 'loading' | 'error' | 'success';
    afterLoginRedirect: string
    assignableUsers: OptionItem[],
    offices: OptionItem[],
    userTypes: OptionItem[],
    ticketListItems: TicketListItem[],
    ticketBoard: BoardColumn<TicketListItem>[],
    userListItems: UserListItem[],
    editingUser: User | null,
    previousUrl: string | null
}

export const initialState: AppState = {
    currentUser: null,
    status: 'pending',
    afterLoginRedirect: '',
    assignableUsers: [],
    offices: [],
    userTypes: [],
    ticketListItems: [],
    ticketBoard: [],
    userListItems: [],
    editingUser: null,
    previousUrl: null
};
