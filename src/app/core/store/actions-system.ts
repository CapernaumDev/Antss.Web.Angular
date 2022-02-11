import { createAction, props } from '@ngrx/store';
import { LoginCredential } from '../models/login-credential';

export const loginWithToken = createAction(
    '[App Startup] Login',
    props<{ loginCredential: LoginCredential }>()
);

export const setAfterLoginRedirect = createAction(
    '[Auth Guard] Set After Login Redirect',
    props<{ url: string }>()
)

export const logoutOnServerUnauthorised = createAction(
    '[Error Interceptor server 401] Logout'
)

export const ticketAnimationPlayed = createAction(
    '[UI Update on Server Push] Ticket Animation Finished Playing',
    props<{ ticketId: number }>()
)

export const setPreviousUrl = createAction(
    '[Route Change] Set Previous Url',
    props<{ url: string }>()
)