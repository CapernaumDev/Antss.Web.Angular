import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CurrentUser } from '../models/user/current-user';
import { selectCurrentUser } from '../store/selectors';

import { NavMenuComponent } from './nav-menu.component';

describe('NavMenuComponent', () => {
  let component: NavMenuComponent;
  let fixture: ComponentFixture<NavMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideMockStore({})],
      declarations: [NavMenuComponent]
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(NavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('when not logged in', () => {
    beforeEach(() => {
      const mockStore = TestBed.inject(MockStore);
      const mockCurrentUserState = mockStore.overrideSelector(selectCurrentUser, null);

      fixture = TestBed.createComponent(NavMenuComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show Login link', () => {
      const element = fixture.debugElement.query(By.css('[href="/login"]'));

      expect(element).toBeTruthy();
    });

    it('should show Home link', () => {
      const element = fixture.debugElement.query(By.css('[href="/"]'));

      expect(element).toBeTruthy();
    });

    it('should show Create Ticket link', () => {
      const element = fixture.debugElement.query(By.css('[href="/create-ticket"]'));

      expect(element).toBeTruthy();
    });

    it('should not show Admin link', () => {
      const element = fixture.debugElement.query(By.css('[href="/user-list"]'));

      expect(element).toBeNull();
    });

    it('should not show Tickets link', () => {
      const element = fixture.debugElement.query(By.css('[href="/ticket-list"]'));

      expect(element).toBeNull();
    });

    it('should not show Board link', () => {
      const element = fixture.debugElement.query(By.css('[href="/ticket-board"]'));

      expect(element).toBeNull();
    });

    it('should not show Logout link', () => {
      const element = fixture.debugElement.query(By.css('[data-test-id="logoutLink"]'));

      expect(element).toBeNull();
    });

    it('should not show My Profile link', () => {
      const element = fixture.debugElement.query(By.css('[href="/my-profile"]'));

      expect(element).toBeNull();
    });
  });

  describe('when logged in not as admin', () => {
    let mockStore: MockStore;
    beforeEach(() => {
      mockStore = TestBed.inject(MockStore);
      const user = new CurrentUser();
      user.id = 1;
      const mockCurrentUserState = mockStore.overrideSelector(selectCurrentUser, user);

      fixture = TestBed.createComponent(NavMenuComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should dispatch logout action when logout link is clicked', () => {
      spyOn(mockStore, 'dispatch').and.stub();
      const logoutLink = fixture.debugElement.query(By.css('[data-test-id="logoutLink"]'));
      logoutLink.nativeElement.click();

      expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
        type: '[Nav Menu] Logout'
      });
    });

    it('should not show Admin link', () => {
      const element = fixture.debugElement.query(By.css('[href="/user-list"]'));

      expect(element).toBeNull();
    });

    it('should show Tickets link', () => {
      const element = fixture.debugElement.query(By.css('[href="/ticket-list"]'));

      expect(element).toBeTruthy();
    });

    it('should show Board link', () => {
      const element = fixture.debugElement.query(By.css('[href="/ticket-board"]'));

      expect(element).toBeTruthy();
    });

    it('should show Logout link', () => {
      const element = fixture.debugElement.query(By.css('[data-test-id="logoutLink"]'));

      expect(element).toBeTruthy();
    });

    it('should show My Profile link', () => {
      const element = fixture.debugElement.query(By.css('[href="/my-profile"]'));

      expect(element).toBeTruthy();
    });
  });

  describe('when logged in as admin', () => {
    beforeEach(() => {
      const mockStore = TestBed.inject(MockStore);
      const user = new CurrentUser();
      user.id = 1;
      user.userType = 'Admin';
      const mockCurrentUserState = mockStore.overrideSelector(selectCurrentUser, user);

      fixture = TestBed.createComponent(NavMenuComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show Admin link', () => {
      const element = fixture.debugElement.query(By.css('[href="/user-list"]'));

      expect(element).toBeTruthy();
    });
  });
});
