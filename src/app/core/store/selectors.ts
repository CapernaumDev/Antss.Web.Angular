import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.state';

const getAppState = createFeatureSelector<AppState>(
  'app'
);

export const selectIsSigningIn = createSelector(
  getAppState,
  (state) => state.status === 'loading'
);

export const selectCurrentUser = createSelector(
  getAppState,
  (state) => state.currentUser
);

export const selectAssignableUsers = createSelector(
  getAppState,
  (state) => state.assignableUsers
);

export const selectOffices = createSelector(
  getAppState,
  (state) => state.offices
);

export const selectUserTypes = createSelector(
  getAppState,
  (state) => state.userTypes
);

export const selectAfterLoginRedirect = createSelector(
  getAppState,
  (state) => state.afterLoginRedirect
);

export const selectPreviousUrl = createSelector(
  getAppState,
  (state) => state.previousUrl
);

export const selectTicketList = createSelector(
  getAppState,
  (state) => state.ticketListItems
);

export const selectTicketBoard = createSelector(
  getAppState,
  (state) => state.ticketBoard
);

export const selectUserList = createSelector(
  getAppState,
  (state) => state.userListItems
);

export const selectLoadedUser = createSelector(
  getAppState,
  (state) => state.editingUser
)