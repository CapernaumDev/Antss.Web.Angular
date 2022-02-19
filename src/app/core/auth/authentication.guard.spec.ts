import { TestBed, getTestBed } from '@angular/core/testing';
import { AuthGuard } from './authentication.guard';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../store/app.state';
import { selectCurrentUser } from '../store/selectors';
import { CurrentUser } from '../models/user/current-user';

describe('AuthGuard', () => {
  let mockStore: MockStore<AppState>;
  let injector: TestBed;
  let guard: AuthGuard;
  let routeMock: any = { snapshot: {}, url: '/ticket-board' };
  let routeStateMock: any = { snapshot: {}, url: '/ticket-list' };
  let routerMock = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: Router, useValue: routerMock }, provideMockStore({})],
      imports: [HttpClientTestingModule]
    });
    injector = getTestBed();
    mockStore = TestBed.inject(MockStore);
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('when not authenticated', () => {
    it('should redirect to the login route', () => {
      mockStore.overrideSelector(selectCurrentUser, null);
      guard.canActivate(routeMock, routeStateMock).subscribe((canActivate) => {
        expect(canActivate).toBe(false);
        expect(routerMock.navigate).toHaveBeenCalledWith(['login']);
      });
    });

    it('should dispatch setAfterLoginRedirect action with current url as parameter to store', () => {
      spyOn(mockStore, 'dispatch');
      mockStore.overrideSelector(selectCurrentUser, null);
      guard.canActivate(routeMock, routeStateMock).subscribe(() => {
        expect(mockStore.dispatch).toHaveBeenCalledOnceWith(
          jasmine.objectContaining({
            type: '[Auth Guard] Set After Login Redirect',
            url: '/ticket-board'
          })
        );
      });
    });
  });

  describe('when not an admin user', () => {
    it('should block navigation when navigating to an admin only route', () => {
      const user = new CurrentUser();
      user.userType = 'support';
      mockStore.overrideSelector(selectCurrentUser, user);
      let adminRoute: any = { snapshot: {}, url: '/ticket-list', data: { role: ['Admin'] } };
      guard.canActivate(adminRoute, routeMock).subscribe((canActivate) => {
        expect(canActivate).toBe(false);
      });
    });
  });

  describe('when an admin user', () => {
    it('should allow navigation to an admin only route', () => {
      const user = new CurrentUser();
      user.userType = 'Admin';
      mockStore.overrideSelector(selectCurrentUser, user);
      let adminRoute: any = { snapshot: {}, url: '/ticket-list', data: { role: ['Admin'] } };
      guard.canActivate(adminRoute, routeMock).subscribe((canActivate) => {
        expect(canActivate).toBe(true);
      });
    });
  });

  describe('when authenticated', () => {
    it('should allow navigation to guarded routes', () => {
      const user = new CurrentUser();
      user.userType = 'Support';
      mockStore.overrideSelector(selectCurrentUser, user);
      let adminRoute: any = { snapshot: {}, url: '/ticket-list' };
      guard.canActivate(adminRoute, routeMock).subscribe((canActivate) => {
        expect(canActivate).toBe(true);
      });
    });
  });
});
