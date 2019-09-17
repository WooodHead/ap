import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { catchError, filter, tap, finalize } from 'rxjs/internal/operators';
import {
  Login,
  LoginFailure,
  LoginSuccess,
  ForceLogin,
  Logout,
  LogoutSuccess,
  LogoutFailure,
  LoginRedirect,
  ChangeFormView,
} from '@app/auth/store/auth.actions';
import { AuthService } from '@app/auth/services/auth.service';
import { OpenPanel } from '@app/panel/store/panel.actions';
import { DialerLogout } from '@dialer/store/dialer.actions';
import { PanelState } from '@app/panel/store/panel.state';
import { WindowService } from '@app/core/services/window/window.service';
import { SocketService } from '@app/core/services/socket.service';

export interface AuthStateModel {
  loading: boolean;
  error: string | null;
  form: any;
  submittedForm: any;
}

export const AUTH_INITIAL_STATE = {
  loading: false,
  error: null,

  submittedForm: null,

  form: {
    value: null,

    recentlyUsed: {
      agent: [],
      extension: [],
    },
  },
}
;

@State<AuthStateModel>({
  name: 'auth',
  defaults: AUTH_INITIAL_STATE,
})
export class AuthState {
  constructor(
    private authService: AuthService,
    private windowService: WindowService,
    private socketService: SocketService,
    private store: Store,
  ) {}

  @Selector()
  static getLoading(state: AuthStateModel) { return state.loading; }

  @Selector()
  static getError(state: AuthStateModel) { return state.error; }

  @Selector()
  static getForm(state: AuthStateModel) { return state.form; }
​
  @Action(Login)
  login({ dispatch, patchState }: StateContext<AuthStateModel>, { payload }: Login) {
    patchState({
      loading: true,
      error: null,
      submittedForm: payload,
    });

    return this.authService
      .login({
        agent: payload.agent,
        extension: payload.extension,
        useWebRTC: payload.useWebRTC,
        secret: payload.secret,
      })
      .pipe(
        tap(agent => dispatch([
          new LoginSuccess(agent, { ...payload }),
          new OpenPanel(payload.view),
        ])),
        catchError(error => dispatch(new LoginFailure(error))),
      );
  }

  @Action(LoginSuccess)
  loginSuccess(
    { getState, patchState }: StateContext<AuthStateModel>,
    { submittedForm }: LoginSuccess,
  ) {
    const { form } = getState();

    function getRecentlyUsed(type) {
      return [submittedForm[type]]
        .concat(form.recentlyUsed[type]) // adds new value to array start
        .filter((v, i, a) => a.indexOf(v) === i) // unique
        .slice(0, 3);
    }

    patchState({
      loading: false,
      form: {
        value: submittedForm,
        recentlyUsed: {
          agent: getRecentlyUsed('agent'),
          extension: getRecentlyUsed('extension'),
        },
      },
    });
  }
​
  @Action(LoginFailure)
  loginFailure({ patchState }: StateContext<AuthStateModel>, { payload }: LoginFailure) {
    patchState({
      loading: false,
      error: payload,
    });
  }

  @Action(ForceLogin)
  forceLogin({ dispatch, getState, patchState }: StateContext<AuthStateModel>) {
    patchState({
      loading: true,
      error: null,
    });

    const { submittedForm } = getState();

    return this.authService
      .login({
        agent: submittedForm.agent,
        extension: submittedForm.extension,
        secret: submittedForm.secret,
        force: true,
      })
      .pipe(
        tap(agent => dispatch([
          new LoginSuccess(agent, submittedForm),
          new OpenPanel(submittedForm.view),
        ])),
        catchError(error => dispatch(new LoginFailure(error))),
      );
  }

  @Action(LoginRedirect)
  loginRedirect({ dispatch }: StateContext<AuthStateModel>) {
    dispatch(new Navigate(['']));
  }

  @Action(Logout)
  logout({ dispatch, patchState, getState }: StateContext<AuthStateModel>) {
    patchState({ loading: true });

    if (this.store.selectSnapshot(PanelState.getMode) === 'dialer') {
      return this.store
        .dispatch(new DialerLogout(true))
        .pipe(
          finalize(() => patchState({ loading: false })),
        );
    }

    const { form } = getState();

    return this.authService
      .logout(form.value.agent)
      .pipe(
        tap(() => dispatch(new LogoutSuccess())),
        catchError(error => dispatch(new LogoutFailure(error))), 
      );
  }

  @Action(LogoutSuccess)
  logoutSuccess({ patchState }: StateContext<AuthStateModel>) {
    patchState({ loading: false });

    // logout action is fired in panel and causes errors because auth.form.agent is null
    this.socketService.disconnect();

    const isPanelOpened = this.store.selectSnapshot(PanelState.getOpened);
    this.windowService.close(isPanelOpened);
  }

  @Action(LogoutFailure)
  logoutFailure({ patchState }: StateContext<AuthStateModel>, { payload }: LogoutFailure) {
    patchState({ loading: false, error: payload });
  }

  @Action(ChangeFormView)
  changeFormView(
    { getState, patchState }: StateContext<AuthStateModel>,
    { payload }: ChangeFormView,
  ) {
    const { form } = getState();
    form.value.view = payload;

    patchState({ form });
  }
}
