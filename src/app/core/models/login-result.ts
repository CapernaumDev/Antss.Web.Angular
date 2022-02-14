import { CurrentUser } from "./user/current-user";

export class LoginResult {
  constructor(user: CurrentUser, accessToken: string) {
    this.user = user;
    this.accessToken = accessToken;
  }

  user: CurrentUser;
  accessToken: string
}
