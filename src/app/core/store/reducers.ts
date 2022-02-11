import { createReducer, on } from '@ngrx/store';
import { CurrentUser } from '../models/user/current-user';
import * as ApiActions from './actions-api';
import * as PushActions from './actions-push';
import * as SystemActions from './actions-system';
import * as UiActions from './actions-ui';
import { initialState } from './app.state';
import produce from "immer";

export const Reducers = createReducer(
  initialState,

  on(UiActions.loginWithCredentials, (state) => ({ ...state, status: 'loading' })),

  on(SystemActions.loginWithToken, (state) => ({ ...state, status: 'loading' })),

  on(ApiActions.loginSuccess, (state, { loginResult }) => ({
    ...state,
    currentUser: Object.assign(new CurrentUser(), {
      ...loginResult.user,
      accessToken: window.btoa(loginResult.accessToken || JSON.parse(localStorage["access-token"]))
    }),
    status: 'success'
  })),

  on(ApiActions.loginFailure, (state) => ({
    ...state,
    status: 'error'
  })),

  on(SystemActions.setAfterLoginRedirect, (state, { url }) => ({
    ...state,
    afterLoginRedirect: url
  })),

  on(PushActions.setInitialAppData, (state, { appData }) => ({
    ...state,
    assignableUsers: appData.assignableUsers,
    offices: appData.offices,
    userTypes: appData.userTypes
  })),

  on(SystemActions.logoutOnServerUnauthorised, UiActions.logoutUserInitiated, (state) => ({
    ...state,
    currentUser: null,
    status: 'pending',
    afterLoginRedirect: ''
  })),

  on(PushActions.updateAssignableUsers, (state, { options }) => ({
    ...state,
    assignableUsers: options
  })),

  on(ApiActions.loadTicketsSuccess, (state, { tickets }) => ({
    ...state,
    ticketListItems: tickets
  })),

  on(PushActions.ticketCreated, (state, { ticket, boardColumnIndex, initiatedByUserId }) => 
    produce(state, draft => {
      if (!draft.ticketListItems.find(x => x.id === ticket.id))
        draft.ticketListItems.push(ticket);

      if (draft.ticketBoard.length && !draft.ticketBoard[0].items.find(x => x.id === ticket.id)) {
        draft.ticketBoard[0].items.splice(0, 0, ticket)
      }
  })),

  on(PushActions.ticketStatusUpdatedByServer, UiActions.ticketStatusUpdatedByUser,
    (state, { ticket, boardColumnIndex }) => produce(state, draft => {
      let ticketInTicketListStateCollection = draft.ticketListItems.find(x => x.id === ticket.id);
      if (ticketInTicketListStateCollection)
        ticketInTicketListStateCollection.ticketStatus = ticket.ticketStatus;

      let destinationBoardColumn = draft.ticketBoard.find(x => x.title === ticket.ticketStatus);
      if (destinationBoardColumn) {
        for (let i = 0; i < draft.ticketBoard.length; i++) {
          let foundTicketIndex = draft.ticketBoard[i].items.findIndex(x => x.id === ticket.id);
          if (foundTicketIndex > -1) {
            draft.ticketBoard[i].items.splice(foundTicketIndex, 1);
            if (boardColumnIndex != null && boardColumnIndex > -1 && destinationBoardColumn.items.length >= boardColumnIndex)
              destinationBoardColumn.items.splice(boardColumnIndex, 0, ticket);
            else
              destinationBoardColumn.items.push(ticket);
            break;
          }
        }
      }
    })),

  on(SystemActions.ticketAnimationPlayed, (state, { ticketId }) => produce(state, draft => {
      for (let i = 0; i < draft.ticketBoard.length; i++) {
        let foundTicket = draft.ticketBoard[i].items.find(x => x.id === ticketId);
        if (foundTicket)  {
          foundTicket.animation = null;
          break;
        }
      }
  })),

  on(ApiActions.loadTicketBoardSuccess, (state, { board }) => ({
    ...state,
    ticketBoard: board
  })),

  on(PushActions.userCreated, (state, { user }) => produce(state, draft => {
    draft.userListItems.push(user);
  })),

  on(PushActions.userUpdated, (state, { user }) => produce(state, draft => {
    let userIndex = draft.userListItems.findIndex(x => x.id === user.id);
    if (userIndex > -1) {
      draft.userListItems.splice(userIndex, 1, user);
    }
  })),

  on(ApiActions.loadUserListSuccess, (state, { users }) => ({
    ...state,
    userListItems: users
  })),

  on(ApiActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    editingUser: user
  })),

  on(SystemActions.setPreviousUrl, (state, { url }) => ({
    ...state,
    previousUrl: url
  }))
);
