import { Agent } from '@app/auth/models/agent.model';
import { LoginForm } from '@app/auth/models/login-form.model';
import { ViewType } from '@app/core/services/window/view.type';

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: LoginForm) {}
}

export class LoginSuccess {
  static readonly type = '[Auth] Login Success';
  constructor(public agent: Agent, public submittedForm: any) {}
}

export class LoginFailure {
  static readonly type = '[Auth] Login Failure';
  constructor(public payload: any) {}
}

export class ForceLogin {
  static readonly type = '[Auth] Force Login';
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class LogoutSuccess {
  static readonly type = '[Auth] Logout Success';
}

export class LogoutFailure {
  static readonly type = '[Auth] Logout Failure';
  constructor(public payload: any) {}
}

export class LoginRedirect {
  static readonly type = '[Auth] Login Redirect';
}

export class ChangeFormView {
  static readonly type = '[Auth] Change Form View';
  constructor(public payload: ViewType) {}
}
