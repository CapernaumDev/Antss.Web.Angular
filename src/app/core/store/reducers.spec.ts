import { initialState, AppState } from './app.state';
import { Reducers } from './reducers'
import * as ApiActions from './actions-api';
import * as PushActions from './actions-push';
import * as SystemActions from './actions-system';
import * as UiActions from './actions-ui';
import { LoginCredential } from '../models/login-credential';
import { LoginResult } from '../models/login-result';
import { User } from '../models/user/user';
import { CurrentUser } from '../models/user/current-user';
import { AppData } from '../models/app-data';
import { TicketListItem } from '../models/ticket/ticket-list-item';
import { BoardColumn } from '../models/board-column';
import { UserListItem } from '../models/user/user-list-item';

let testState!: AppState;
const aValidUser: User = {
    contactNumber: '',
    emailAddress: '',
    firstName: '',
    id: 1,
    lastName: '',
    officeId: 1,
    userType: '',
    userTypeId: 1,
}
const currentUser = aValidUser as CurrentUser;

describe('Reducers', () => {
    beforeEach(() => {
        testState = JSON.parse(JSON.stringify(initialState)) as AppState;
    });

    const credential = new LoginCredential();
    it('UiActions.loginWithCredentials sets status to loading', () => {
        const state = Reducers(testState, UiActions.loginWithCredentials({loginCredential: credential}));
        expect(state.status).toEqual('loading');
    });    

    it('SystemActions.loginWithToken sets status to loading', () => {
        const state = Reducers(testState, SystemActions.loginWithToken({loginCredential: credential}));
        expect(state.status).toEqual('loading');
    });  
    
    it ('ApiActions.loginSuccess sets currentuser with base64 token from loginResult', () => {
        const loginResult = new LoginResult(currentUser, 'qwer');
        const state = Reducers(testState, ApiActions.loginSuccess({loginResult: loginResult}));
        let expectedCurrentUser = JSON.parse(JSON.stringify(currentUser)) as CurrentUser;
        expectedCurrentUser.accessToken = window.btoa('qwer');
        expect(JSON.stringify(state.currentUser)).toEqual(JSON.stringify(expectedCurrentUser));
    });

    it('ApiActions.loginFailure sets status to error', () => {
        const state = Reducers(testState, ApiActions.loginFailure({ message: 'test' }));
        expect(state.status).toEqual('error');
    });  

    it('SystemActions.setAfterLoginRedirect sets status to error', () => {
        const state = Reducers(testState, SystemActions.setAfterLoginRedirect({ url: 'asdaf' }));
        expect(state.afterLoginRedirect).toEqual('asdaf');
    });  

    it('PushActions.setInitialAppData sets option list data', () => {
        const appData = new AppData();
        appData.assignableUsers = [{value: 1, label: ''}];
        appData.offices = [{value: 3, label: ''}];
        appData.userTypes = [{value: 2, label: ''}];
        const state = Reducers(testState, PushActions.setInitialAppData({ appData: appData }));
        expect(state.assignableUsers).toEqual(appData.assignableUsers);
        expect(state.offices).toEqual(appData.offices);
        expect(state.userTypes).toEqual(appData.userTypes);
    });  

    it('SystemActions.logoutOnServerUnauthorised sets status to pending, currentUser to null, afterloginredirect to empty', () => {
        testState.afterLoginRedirect = 'sad';
        testState.currentUser = currentUser;
        testState.status = 'success';
        const state = Reducers(testState, SystemActions.logoutOnServerUnauthorised());
        expect(state.afterLoginRedirect).toEqual('');
        expect(state.currentUser).toBe(null);
        expect(state.status).toEqual('pending');
    });  

    it('PushActions.updateAssignableUsers sets assignableUsers', () => {
        const assignableUsers = [{value: 1, label: ''}];
        const state = Reducers(testState, PushActions.updateAssignableUsers({ options: assignableUsers }));
        expect(state.assignableUsers).toEqual(assignableUsers);
    });  

    it('ApiActions.loadTicketsSuccess sets ticketListItems', () => {
        const tickets = [new TicketListItem(), new TicketListItem()];
        const state = Reducers(testState, ApiActions.loadTicketsSuccess({ tickets: tickets }));
        expect(state.ticketListItems).toBe(tickets);
    }); 

    it('PushActions.ticketCreated adds to ticketlist items when the item does not already exist', () => {
        const ticket = new TicketListItem();
        const state = Reducers(testState, PushActions.ticketCreated({ ticket: ticket, boardColumnIndex: 2, initiatedByUserId: 2 }));
        expect(state.ticketListItems[0]).toBe(ticket);
    });  

    it('PushActions.ticketCreated does not add to ticketlist items when the item id already exists', () => {
        const ticket = new TicketListItem();
        ticket.id = 123;
        testState.ticketListItems.push(ticket);
        const state = Reducers(testState, PushActions.ticketCreated({ ticket: ticket, boardColumnIndex: 2, initiatedByUserId: 2 }));
        expect(state.ticketListItems.length).toBe(1);
    });  

    it('PushActions.ticketCreated adds to ticket board items when the item does not already exist', () => {
        const ticket = new TicketListItem();
        ticket.ticketStatus = 'raised';
        const column = new BoardColumn('raised', 1, []);
        testState.ticketBoard = [column];
        const state = Reducers(testState, PushActions.ticketCreated({ ticket: ticket, boardColumnIndex: 2, initiatedByUserId: 2 }));
        expect(state.ticketBoard[0].items[0]).toBe(ticket);
    });  

    it('PushActions.ticketCreated does not add to ticket board items when the item id already exists', () => {
        const ticket = new TicketListItem();
        ticket.ticketStatus = 'raised';
        const column = new BoardColumn('raised', 1, [ticket]);
        testState.ticketBoard = [column];
        const state = Reducers(testState, PushActions.ticketCreated({ ticket: ticket, boardColumnIndex: 2, initiatedByUserId: 2 }));
        expect(state.ticketBoard[0].items.length).toBe(1);
    });  

    it('PushActions.ticketStatusUpdatedByServer updates ticketlist item status', () => {
        const ticket = new TicketListItem();
        ticket.id = 1;
        ticket.ticketStatus = 'raised';
        testState.ticketListItems = [ticket];
        const updatedTicket = new TicketListItem();
        updatedTicket.id = 1;
        updatedTicket.ticketStatus = 'complete';
        const state = Reducers(testState, PushActions.ticketStatusUpdatedByServer({ ticket: updatedTicket, boardColumnIndex: 2, initiatedByUserId: 2 }));
        expect(state.ticketListItems[0].ticketStatus).toBe('complete');
    });  

    it('PushActions.ticketStatusUpdatedByServer updates ticket board moving item between columns', () => {
        const ticket = new TicketListItem();
        ticket.id = 1;
        ticket.ticketStatus = 'raised';
        const column1 = new BoardColumn('raised', 1, [ticket]);
        const column2 = new BoardColumn('complete', 1, []);
        testState.ticketBoard = [column1, column2];
        const updatedTicket = new TicketListItem();
        updatedTicket.id = 1;
        updatedTicket.ticketStatus = 'complete';
        const state = Reducers(testState, PushActions.ticketStatusUpdatedByServer({ ticket: updatedTicket, boardColumnIndex: 0, initiatedByUserId: 2 }));
        
        expect(state.ticketBoard[0].items.length).toBe(0);
        expect(state.ticketBoard[1].items.length).toBe(1);
        expect(state.ticketBoard[1].items[0].ticketStatus).toBe('complete');
    });  

    it('SystemActions.ticketAnimationPlayed should set ticket board item animation to null', () => {
        const ticket = new TicketListItem();
        ticket.id = 1;
        ticket.animation = 'dsaasdds';
        const column1 = new BoardColumn('raised', 1, [ticket]);
        testState.ticketBoard = [column1];
        const state = Reducers(testState, SystemActions.ticketAnimationPlayed({ ticketId: 1 }));

        expect(state.ticketBoard[0].items[0].animation).toBe(null);
    });

    it('ApiActions.loadTicketBoardSuccess should set ticket board', () => {
        const column1 = new BoardColumn('raised', 1, []);
        const board = [column1];
        testState.ticketBoard = board;
        const state = Reducers(testState, ApiActions.loadTicketBoardSuccess({ board: board }));

        expect(state.ticketBoard).toBe(board);
    });

    it('PushActions.userCreated should add to userlist', () => {
        const user = new UserListItem();
        const state = Reducers(testState, PushActions.userCreated({ user: user }));

        expect(state.userListItems.length).toBe(1);
        expect(state.userListItems[0]).toBe(user);
    });

    it('PushActions.userUpdated should replace user in userlist', () => {
        const user = new UserListItem();
        testState.userListItems.push(user);
        const updatedUser = new UserListItem();
        const state = Reducers(testState, PushActions.userUpdated({ user: updatedUser }));

        expect(state.userListItems.length).toBe(1);
        expect(state.userListItems[0]).toBe(updatedUser);
    });

    it('ApiActions.loadUserListSuccess should set userlist', () => {
        const users = [new UserListItem()];
        const state = Reducers(testState, ApiActions.loadUserListSuccess({ users: users }));

        expect(state.userListItems).toBe(users);
    });

    it('ApiActions.loadUserSuccess should set editingUser', () => {
        const user = new User();
        const state = Reducers(testState, ApiActions.loadUserSuccess({ user: user }));

        expect(state.editingUser).toBe(user);
    });

    it('SystemActions.setPreviousUrl should set previousUrl', () => {
        const state = Reducers(testState, SystemActions.setPreviousUrl({ url: 'sadasf' }));

        expect(state.previousUrl).toBe('sadasf');
    });
});