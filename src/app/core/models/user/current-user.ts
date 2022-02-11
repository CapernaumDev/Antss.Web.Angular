import { User } from "./user";

export class CurrentUser extends User {
  public accessToken!: string;
  constructor() {
    super();
  }

  get isAdmin() {
    return this.userType === 'Admin';
  }

  get isSupport() {
    return this.userType === 'Support' || this.userType === 'Admin';
  }

  get isUser() {
    return this.userType === 'User';
  }

  get isLoggedIn() {
    return this.id > 0;
  }

  get apiToken() {
    return window.btoa(this.accessToken);
  }
}
