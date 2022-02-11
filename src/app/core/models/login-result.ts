import { CurrentUser } from "./user/current-user";

export class LoginResult {
  user!: CurrentUser;
  accessToken!: string
}
