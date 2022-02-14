import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { ApiService } from '@app/core/api.service';
import * as ApiActions from './actions-api';
import * as SystemActions from './actions-system';
import * as UiActions from './actions-ui';
import { Effects } from './effects';
import { AppState } from './app.state';
import { LoginCredential } from '../models/login-credential';
import { LoginResult } from '../models/login-result';
import { User } from '../models/user/user';
import { CurrentUser } from '../models/user/current-user';
import { selectAfterLoginRedirect, selectCurrentUser, selectPreviousUrl } from './selectors';
import { RouterTestingModule } from '@angular/router/testing';
import { SignalRService } from '../signalr.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { UpdateTicketStatus } from '../models/ticket/update-ticket-status';

const initialState: AppState = {
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

let aValidUser: User = {
    contactNumber: '',
    emailAddress: '',
    firstName: '',
    id: 1,
    lastName: '',
    officeId: 1,
    userType: '',
    userTypeId: 1,
}

const currentUser: CurrentUser = aValidUser as CurrentUser;
const aValidCredential = { loginCredential: { emailAddress: 'w', passWord: 't', accessToken: '' } };

class MockApiService {
    login(loginCredential: LoginCredential): Observable<LoginResult> {
        return of(new LoginResult(currentUser, ''));
    }
    getTicketList() {}
    getTicketBoard() {}
    getUserList() {}
    createTicket() {}
    createUser() {}
    loadUser() {}
    updateUser() {}
    updateTicketStatus() {}
}

class MockSignalRService {
    startConnection() {}
}

class MockComponent {}
const mockDocument = { defaultView: { location: { href: 'someroute' } } }; 

describe('AppEffects', () => {
    let actions$: Observable<any>;
    let effects: Effects;
    let store: MockStore<AppState>;
    let apiService: ApiService;
    let signalRService: SignalRService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([
                { path: 'abcde/123', component: MockComponent }
            ])],
            providers: [
                Effects,
                provideMockActions(() => actions$),
                provideMockStore({ initialState }),
                { provide: ApiService, useClass: MockApiService },
                { provide: SignalRService, useClass: MockSignalRService },
                { provide: DOCUMENT, useValue: mockDocument }
            ]
        });

        effects = TestBed.inject(Effects);
        store = TestBed.inject(MockStore);
        apiService = TestBed.inject(ApiService);
        signalRService = TestBed.inject(SignalRService);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    describe('login$', () => {
        it('should invoke the api service login method with the supplied credentials on user initiated login', fakeAsync(() => {
            const spy = spyOn(apiService, 'login').and.callThrough();
            actions$ = of(UiActions.loginWithCredentials(aValidCredential));
            effects.login$.subscribe((result) => {
                expect(spy).toHaveBeenCalledOnceWith(aValidCredential.loginCredential);
            });
        }));

        it('should invoke the api service login method with the supplied token on system initiated login', fakeAsync(() => {
            const spy = spyOn(apiService, 'login').and.callThrough();
            const credential = { loginCredential: { emailAddress: '', passWord: '', accessToken: 'w' } };
            actions$ = of(SystemActions.loginWithToken(credential));
            effects.login$.subscribe((result) => {
                expect(spy).toHaveBeenCalledOnceWith(credential.loginCredential);
            });
        }));

        it('should invoke the loginSuccess action with the login result when the api returns a successful login result', fakeAsync(() => {
            const expectedPayloadForLoginSuccessAction = { user: currentUser, accessToken: 'abc' };
            const spy = spyOn(apiService, 'login').and.returnValue(of(expectedPayloadForLoginSuccessAction));
            actions$ = of(UiActions.loginWithCredentials(aValidCredential));
            effects.login$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[Login API] Login Success',
                    loginResult: expectedPayloadForLoginSuccessAction,
                });
            });
        }));

        it('should invoke the loginFailure action with the error message when the api returns an error', fakeAsync(() => {
            const errorResponse = new Error('123')
            spyOn(apiService, 'login').and.returnValue(throwError(() => errorResponse));
            actions$ = of(UiActions.loginWithCredentials(aValidCredential));
            effects.login$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[Login API] Login Failure',
                    message: '123'
                });
            });
        }));
    });

    describe('loginSuccess', () => {
        beforeEach(() => {
            store.overrideSelector(selectAfterLoginRedirect, 'abcde/123');
            store.overrideSelector(selectCurrentUser, currentUser);
        });

        it('should set localstorage access token to the access token payload', fakeAsync(() => {
            const spy = spyOn(localStorage, 'setItem').and.callFake(() => true);
            const loginSuccessResult = new LoginResult(currentUser, 'qwee');
            actions$ = of(ApiActions.loginSuccess({ loginResult: loginSuccessResult }));
            effects.loginSuccess.subscribe(() => {
                expect(spy).toHaveBeenCalledOnceWith('access-token', 'qwee');
            });
        }));

        it ('should call signalr startConnection with the users id', fakeAsync(() => {
            const spy = spyOn(signalRService, 'startConnection');
            const loginSuccessResult = new LoginResult(currentUser, 'qwee');
            actions$ = of(ApiActions.loginSuccess({ loginResult: loginSuccessResult }));
            effects.loginSuccess.subscribe(() => {
                expect(spy).toHaveBeenCalledOnceWith(currentUser.id);
            });
        }));

        it ('should redirect to the redirectUrl', inject([Router], fakeAsync((router: Router) => {
            const spy = spyOn(router, 'navigateByUrl').and.stub();
            const loginSuccessResult = new LoginResult(currentUser, 'qwee');
            actions$ = of(ApiActions.loginSuccess({ loginResult: loginSuccessResult }));
            effects.loginSuccess.subscribe(() => {
                expect(spy).toHaveBeenCalledOnceWith('abcde/123');
            });
        })));
    });

    describe('logout$', () => {
        it('should be called on user initiated logout', fakeAsync(() => {
            actions$ = of(UiActions.logoutUserInitiated);
            effects.logout$.subscribe((action) => {
                expect(action).toBeTruthy();
            });
        }));

        it('should be called on system initiated logout', fakeAsync(() => {
            actions$ = of(SystemActions.logoutOnServerUnauthorised);
            effects.logout$.subscribe((action) => {
                expect(action).toBeTruthy();
            });
        }));

        it('should clear the access token from local storage', fakeAsync(() => {
            const spy = spyOn(localStorage, 'removeItem').and.callFake(() => true);
            actions$ = of(UiActions.logoutUserInitiated);
            effects.logout$.subscribe((action) => {
                expect(spy).toHaveBeenCalledOnceWith('access-token');
            });
        }));

        it('should http navigate to the homepage', fakeAsync(() => {
            actions$ = of(UiActions.logoutUserInitiated);
            effects.logout$.subscribe((action) => {
                expect(mockDocument.defaultView.location.href).toEqual('/');
            });
        }));
    });

    describe('loadTickets$', () => {
        it('should call getticketlist with the supplied parameters', fakeAsync(() => {
            const spy = spyOn(apiService, 'getTicketList').and.returnValue(of([]));
            actions$ = of(UiActions.loadTicketsRequested({ includeClosed: true }));
            effects.loadTickets$.subscribe(() => {
                expect(spy).toHaveBeenCalledOnceWith(true);
            });
        }));

        it('should invoke loadticketssuccess action with the result from getticketlist success', fakeAsync(() => {
            const apiResult = [{
                id: 1, raisedBy: '', assignedTo: '', ticketStatus: '', description: '', title: '', animation: ''
            }];
            spyOn(apiService, 'getTicketList').and.returnValue(of(apiResult));
            actions$ = of(UiActions.loadTicketsRequested({ includeClosed: true }));
            effects.loadTickets$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[Ticket API] Load Tickets Success',
                    tickets: apiResult
                });
            });
        }));

        it('should invoke loadticketsfailure action on getticketlist error', fakeAsync(() => {
            const errorResponse = new Error();
            spyOn(apiService, 'getTicketList').and.returnValue(throwError(() => errorResponse));
            actions$ = of(UiActions.loadTicketsRequested({ includeClosed: true }));
            effects.loadTickets$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[Ticket API] Load Tickets Failure',
                });
            });
        }));
    });

    describe('loadTicketBoard$', () => {
        it('should call getTicketBoard with the supplied parameters', fakeAsync(() => {
            const spy = spyOn(apiService, 'getTicketBoard').and.returnValue(of([]));
            actions$ = of(UiActions.loadTicketBoardRequested({ includeClosed: true }));
            effects.loadTicketBoard$.subscribe(() => {
                expect(spy).toHaveBeenCalledOnceWith(true);
            });
        }));

        it('should invoke loadTicketBoardSuccess action with the result from getTicketBoard success', fakeAsync(() => {
            const apiResult = [ { title: '', id: 1, items: [{
                id: 1, raisedBy: '', assignedTo: '', ticketStatus: '', description: '', title: '', animation: ''
            }]}];
            spyOn(apiService, 'getTicketBoard').and.returnValue(of(apiResult));
            actions$ = of(UiActions.loadTicketBoardRequested({ includeClosed: true }));
            effects.loadTicketBoard$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[Ticket API] Load Ticket Board Success',
                    board: apiResult
                });
            });
        }));

        it('should invoke loadTicketBoardFailure action on getTicketBoard error', fakeAsync(() => {
            const errorResponse = new Error();
            spyOn(apiService, 'getTicketBoard').and.returnValue(throwError(() => errorResponse));
            actions$ = of(UiActions.loadTicketBoardRequested({ includeClosed: true }));
            effects.loadTicketBoard$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[Ticket API] Load Ticket Board Failure',
                });
            });
        }));
    });

    describe('loadUsers$', () => {
        it('should call getUserList', fakeAsync(() => {
            const spy = spyOn(apiService, 'getUserList').and.returnValue(of([]));
            actions$ = of(UiActions.loadUserListRequested());
            effects.loadUsers$.subscribe(() => {
                expect(spy).toHaveBeenCalledTimes(1);
            }); 
        }));

        it('should invoke loadUserListSuccess action with the result from getUserList success', fakeAsync(() => {
            const apiResult = [{
                id: 1, firstName: '', lastName: '', userType: '', contactNumber: '', emailAddress: '', officeName: ''
            }];
            spyOn(apiService, 'getUserList').and.returnValue(of(apiResult));
            actions$ = of(UiActions.loadUserListRequested());
            effects.loadUsers$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[User API] Load User List Success',
                    users: apiResult
                });
            });
        }));

        it('should invoke loadUserListFailure action on getUserList error', fakeAsync(() => {
            const errorResponse = new Error();
            spyOn(apiService, 'getUserList').and.returnValue(throwError(() => errorResponse));
            actions$ = of(UiActions.loadUserListRequested());
            effects.loadUsers$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[User API] Load User List Failure',
                });
            });
        }));
    });

    describe('createTicketRequested$', () => {
        it('should call createTicket with the supplied parameters', fakeAsync(() => {
            const createTicket = { raisedById: 1, assignedToId: 1, description: '' };
            const spy = spyOn(apiService, 'createTicket').and.returnValue(of({}));
            actions$ = of(UiActions.createTicketRequested({ ticket: createTicket }));
            effects.createTicketRequested$.subscribe(() => {
                expect(spy).toHaveBeenCalledOnceWith(createTicket);
            });
        }));

        it('should invoke createTicketSuccess action on createTicket success', fakeAsync(() => {
            const createTicket = { raisedById: 1, assignedToId: 1, description: '' };
            spyOn(apiService, 'createTicket').and.returnValue(of({}));
            actions$ = of(UiActions.createTicketRequested({ ticket: createTicket }));
            effects.createTicketRequested$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[Ticket API] Create Ticket Success'
                });
            });
        }));

        it('should invoke createTicketFailure action on createTicket error', fakeAsync(() => {
            const createTicket = { raisedById: 1, assignedToId: 1, description: '' };
            const errorResponse = new Error();
            spyOn(apiService, 'createTicket').and.returnValue(throwError(() => errorResponse));
            actions$ = of(UiActions.createTicketRequested({ ticket: createTicket }));
            effects.createTicketRequested$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[Ticket API] Create Ticket Failure',
                });
            });
        }));
    });

    describe('createTicketSuccess$', () => { 
        it('should navigate to previous url if it is set in store', inject([Router], fakeAsync((router: Router) => {
            store.overrideSelector(selectPreviousUrl, 'asdf/dsa');         
            const spy = spyOn(router, 'navigateByUrl').and.stub();
            actions$ = of(ApiActions.createTicketSuccess());
            effects.createTicketSuccess$.subscribe(() => {
                expect(spy).toHaveBeenCalledOnceWith('asdf/dsa');
            }); 
        })));

        it('should navigate to ticket list if previous url is not set in store', inject([Router], fakeAsync((router: Router) => {
            store.overrideSelector(selectPreviousUrl, null);         
            const spy = spyOn(router, 'navigateByUrl').and.stub();
            actions$ = of(ApiActions.createTicketSuccess());
            effects.createTicketSuccess$.subscribe(() => {
                expect(spy).toHaveBeenCalledOnceWith('ticket-list');
            });    
        })));
    });

    describe('loadUserRequested$', () => {
        it('should call loadUser with the supplied parameters', fakeAsync(() => {
            const spy = spyOn(apiService, 'loadUser').and.returnValue(of(aValidUser));
            actions$ = of(UiActions.loadUserRequested({ userId: 123 }));
            effects.loadUserRequested$.subscribe(() => {
                expect(spy).toHaveBeenCalledOnceWith(123);
            }); 
        }));

        it('should invoke loadUserSuccess action with the result from loadUser success', fakeAsync(() => {
            spyOn(apiService, 'loadUser').and.returnValue(of(aValidUser));
            actions$ = of(UiActions.loadUserRequested({ userId: 123 }));
            effects.loadUserRequested$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[User API] Load User Success',
                    user: aValidUser
                });
            });
        }));

        it('should invoke loadUserFailure action on loadUser error', fakeAsync(() => {
            const errorResponse = new Error();
            spyOn(apiService, 'loadUser').and.returnValue(throwError(() => errorResponse));
            actions$ = of(UiActions.loadUserRequested({ userId: 123 }));
            effects.loadUserRequested$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[User API] Load User Failed',
                });
            });
        }));
    });

    describe('createUserRequested$', () => {
        it('should call createUser with the supplied parameters', fakeAsync(() => {
            const postResult = { isValid: true, errorMessage: '' }
            const spy = spyOn(apiService, 'createUser').and.returnValue(of(postResult));
            actions$ = of(UiActions.createUserRequested({ user: aValidUser }));
            effects.createUserRequested$.subscribe(() => {
                expect(spy).toHaveBeenCalledOnceWith(aValidUser);
            });
        }));

        it('should invoke createUserSuccess action on createUser success', fakeAsync(() => {
            const postResult = { isValid: true, errorMessage: '' }
            spyOn(apiService, 'createUser').and.returnValue(of(postResult));
            actions$ = of(UiActions.createUserRequested({ user: aValidUser }));
            effects.createUserRequested$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[User API] Create User Success'
                });
            });
        }));

        it('should invoke createUserFailure action on createUser error', fakeAsync(() => {
            const errorResponse = new Error();
            spyOn(apiService, 'createUser').and.returnValue(throwError(() => errorResponse));
            actions$ = of(UiActions.createUserRequested({ user: aValidUser }));
            effects.createUserRequested$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[User API] Create User Failed',
                });
            });
        }));
    });

    describe('updateUserRequested$', () => {
        it('should call updateUser with the supplied parameters', fakeAsync(() => {
            const postResult = { isValid: true, errorMessage: '' }
            const spy = spyOn(apiService, 'updateUser').and.returnValue(of(postResult));
            actions$ = of(UiActions.updateUserRequested({ user: aValidUser }));
            effects.updateUserRequested$.subscribe(() => {
                expect(spy).toHaveBeenCalledOnceWith(aValidUser);
            });
        }));

        it('should invoke updateUserSuccess action on updateUser success', fakeAsync(() => {
            const postResult = { isValid: true, errorMessage: '' }
            spyOn(apiService, 'updateUser').and.returnValue(of(postResult));
            actions$ = of(UiActions.updateUserRequested({ user: aValidUser }));
            effects.updateUserRequested$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[User API] Update User Success'
                });
            });
        }));

        it('should invoke updateUserFailure action on updateUser error', fakeAsync(() => {
            const errorResponse = new Error();
            spyOn(apiService, 'updateUser').and.returnValue(throwError(() => errorResponse));
            actions$ = of(UiActions.updateUserRequested({ user: aValidUser }));
            effects.updateUserRequested$.subscribe((action) => {
                expect(action).toEqual({
                    type: '[User API] Update User Failed',
                });
            });
        }));
    });

    describe('createOrUpdateUserSuccess', () => { 
        it('should be called on create user success', inject([Router], fakeAsync((router: Router) => {
            const spy = spyOn(router, 'navigateByUrl').and.stub();
            actions$ = of(ApiActions.createUserSuccess);
            effects.createOrUpdateUserSuccess$.subscribe((action) => {
                expect(action).toBeTruthy();
            });
        })));

        it('should be called on update user success', inject([Router], fakeAsync((router: Router) => {
            const spy = spyOn(router, 'navigateByUrl').and.stub();
            actions$ = of(ApiActions.updateUserSuccess);
            effects.createOrUpdateUserSuccess$.subscribe((action) => {
                expect(action).toBeTruthy();
            });
        })));

        it ('should redirect to user list', inject([Router], fakeAsync((router: Router) => {
            const spy = spyOn(router, 'navigateByUrl').and.stub();
            actions$ = of(ApiActions.updateUserSuccess);
            effects.createOrUpdateUserSuccess$.subscribe((action) => {
                expect(spy).toHaveBeenCalledOnceWith('user-list');
            });
        })));     
     });

     describe('updateTicketStatusRequested$', () => {
        it('should call updateTicketStatus with the transformed parameters', fakeAsync(() => {
            const ticket = { id: 333, description: '', assignedTo: '', raisedBy: '', ticketStatus: '', title: '', animation: '' };
            const expectedParameter = new UpdateTicketStatus(333, 2, 222);
            const spy = spyOn(apiService, 'updateTicketStatus').and.returnValue(of({}));
            actions$ = of(UiActions.ticketStatusUpdatedByUser({ ticket: ticket, boardColumnIndex: 222, newTicketStatusId: 2 }));
            effects.updateTicketStatusRequested.subscribe(() => {
                expect(spy).toHaveBeenCalledOnceWith(expectedParameter);
            });
        }));

        it('should invoke updateTicketStatusSuccess action on updateTicketStatus success', fakeAsync(() => {
            const ticket = { id: 333, description: '', assignedTo: '', raisedBy: '', ticketStatus: '', title: '', animation: '' };
            spyOn(apiService, 'updateTicketStatus').and.returnValue(of({}));
            actions$ = of(UiActions.ticketStatusUpdatedByUser({ ticket: ticket, boardColumnIndex: 222, newTicketStatusId: 2 }));
            effects.updateTicketStatusRequested.subscribe((action) => {
                expect(action).toEqual({
                    type: '[Ticket API] Update Ticket Status Success'
                });
            });
        }));

        it('should invoke updateTicketStatusFailure action on updateTicketStatus error', fakeAsync(() => {
            const errorResponse = new Error();
            const ticket = { id: 333, description: '', assignedTo: '', raisedBy: '', ticketStatus: '', title: '', animation: '' };
            spyOn(apiService, 'updateTicketStatus').and.returnValue(throwError(() => errorResponse));
            actions$ = of(UiActions.ticketStatusUpdatedByUser({ ticket: ticket, boardColumnIndex: 222, newTicketStatusId: 2 }));;
            effects.updateTicketStatusRequested.subscribe((action) => {
                expect(action).toEqual({
                    type: '[Ticket API] Update Ticket Status Failed',
                });
            });
        }));
    });
});