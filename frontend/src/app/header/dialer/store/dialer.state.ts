import { State, Action, Store, Selector, StateContext } from '@ngxs/store';
import {
  DialerLogout,
  DialerLogoutFailure,
  DialerPause,
  DialerUnPause,
  DialerDial,
  DialerHangUp,
  DialerHold,
  DialerQuickHangUp,
  DialerDisconnected,
  DialerLeadDisconnected,
  DialerLogoutSuccess,
  UpdateLead,
  DialerSetStatus,
  DialerSetFromStorage,
  DialerTransfer,
  SetLead,
  DialerReLogin,
  DialerLoginFailure,
  DialerSetShowDispoModal,
  CreateIframe,
  DestroyIframe,
} from '@dialer/store/dialer.actions';
import { ConfigService } from '@app/core/services/config/config.service';
import { DialerApiService } from '@dialer/services/dialer-api.service';
import { tap, catchError, finalize, switchMap } from 'rxjs/operators';
import { ChangePanelMode, ResetPanelMode, ShowError } from '@app/panel/store/panel.actions';
import { DialerCampaignState } from '@dialer/store/dialer-campaigns.state';
import { DialerRedialState } from '@dialer/store/dialer-redial.state';
import { DialerCallbacksState } from '@dialer/store/dialer-callbacks.state';
import { RemoveCallback } from '@dialer/store/dialer-callbacks.actions';
import { SetActiveCampaign } from '@dialer/store/dialer-campaigns.actions';
import { UserState } from '@app/auth/store/user.state';
import { DialerStatusState } from '@dialer/store/dialer-statuses.state';
import { PanelState } from '@app/panel/store/panel.state';
import { Logout } from '@app/auth/store/auth.actions';
import { DialerIframeService } from '@app/header/dialer/services/dialer-iframe.service';

export class DialerStateModel {
  loading: boolean;
  onHold: boolean;
  shouldShowDispo: boolean;
  lead: any;
}

@State<DialerStateModel>({
  name: 'dialer',
  defaults: {
    loading: false,
    shouldShowDispo: true,
    lead: {},
    onHold: false,
  },
  children: [
    DialerCampaignState,
    DialerRedialState,
    DialerCallbacksState,
    DialerStatusState,
  ],
})
export class DialerState {
  constructor(
    private config: ConfigService,
    private dialerApiService: DialerApiService,
    private store: Store,
    private iframeService: DialerIframeService,
  ) {}

  @Selector()
  static getLoading(state) { return state.loading; }

  @Selector()
  static getOnHold(state) { return state.onHold; }

  @Selector()
  static getShouldShowDispo(state) { return state.shouldShowDispo; }

  @Selector()
  static getLead(state) { return state.lead; }

  @Selector()
  static getSessionData(state) { return state.sessionData; }

  @Action(DialerSetFromStorage)
  setState(
    { patchState, dispatch }: StateContext<DialerStateModel>,
    { payload }: DialerSetFromStorage,
  ) {
    // handle children states
    switch (payload.key) {
      case 'campaigns.active':
        dispatch(new SetActiveCampaign(payload.value));
        break;

      default:
        patchState({ [payload.key]: payload.value });
    }
  }

  @Action(DialerLogout)
  onLogout({ patchState, dispatch }, { shouldClosePanel }: DialerLogout) {
    patchState({ loading: true });

    return this.dialerApiService
      .logout()
      .pipe(
        tap(() => dispatch([
          new DialerLogoutSuccess(shouldClosePanel),
          new DestroyIframe()
        ])),
        catchError(error => dispatch(new DialerLogoutFailure(error))),
        finalize(() => patchState({ loading: false })),
      );
  }

  @Action(DialerLogoutSuccess)
  onLogoutSuccess({ patchState, dispatch }, { shouldClosePanel }: DialerLogoutSuccess) {
    const mode = this.store.selectSnapshot(PanelState.getMode);

    if (shouldClosePanel) {
      dispatch([
        new ResetPanelMode(),
        new Logout(),
      ]);
    } else if (mode === 'dialer') {
      dispatch(new ChangePanelMode());
    }
  }

  @Action(DialerLogoutFailure)
  onDialerLogoutFailure({ dispatch }, { error }: DialerLogoutFailure) {
    dispatch(new ShowError(error));
  }

  @Action(DialerPause)
  onPause({ getState }, { data }: DialerPause) {
    return this.dialerApiService.pause(data);
  }

  @Action(DialerUnPause)
  onUnPause({ getState }, { data }: DialerPause) {
    return this.dialerApiService.unpause(data);
  }

  @Action(DialerHangUp)
  onHangUp({ patchState }) {
    patchState({ loading: true });

    this.dialerApiService
      .hangUp()
      .subscribe(() => patchState({ loading: false, onHold: false }));
  }

  @Action(DialerQuickHangUp)
  onQuickHangUp({ patchState, dispatch }: StateContext<DialerStateModel>) {
    patchState({ loading: true, shouldShowDispo: false });

    this.dialerApiService
      .hangUp()
      .pipe(
        switchMap(() => dispatch(new DialerSetStatus('status', { status: 'A' }))),
      )
      .subscribe(() => patchState({ loading: false }));
  }

  @Action(DialerSetStatus)
  onSetStatus(
    { getState }: StateContext<DialerStateModel>,
    { type, data }: DialerSetStatus,
  ) {
    const { lead } = getState();

    const statusData = {
      ...data,
      lead: {
        ...lead,
        ...data.lead,
      },
    };

    return this.dialerApiService.setStatus(type, statusData);
  }

  @Action(DialerSetShowDispoModal)
  onSetShowDispoModal({ patchState }) {
    patchState({ shouldShowDispo: true });
  }

  @Action(DialerDial)
  onDial({ dispatch }, { data }: DialerDial) {
    return this.dialerApiService
      .dial(data)
      .pipe(
        tap(() => {
          if (data.leadId) {
            dispatch(new RemoveCallback(data.leadId));
          }
        }),
        catchError(error => dispatch(new ShowError(error))),
      );
  }

  @Action(DialerTransfer)
  onTransfer({ dispatch }, { data }: DialerTransfer) {
    return this.dialerApiService
      .transfer(data)
      .pipe(
        catchError(error => dispatch(new ShowError(error))),
      );
  }

  @Action(DialerHold)
  onHold({ getState, patchState, dispatch }) {
    const {
      onHold,
    } = getState();
    return this.dialerApiService
      .hold(!onHold)
      .pipe(
        tap(() => {
          patchState({ onHold: !onHold });
        }),
        catchError(error => dispatch(new ShowError(error))),
      );
  }

  @Action(SetLead)
  onSetLead({ patchState }: StateContext<DialerStateModel>, { lead }: SetLead) {
    patchState({ lead });
  }

  @Action(UpdateLead)
  onUpdateLead(
    { getState, patchState, dispatch }: StateContext<DialerStateModel>,
    { lead: data }: UpdateLead,
  ) {
    const { lead: currentLead } = getState();

    const lead = Object.assign(currentLead, data);

    return this.dialerApiService
      .updateLead({ lead, onlyLeadData: true })
      .pipe(
        tap(() => patchState({ lead })),
        catchError(error => dispatch(new ShowError(error))),
      );
  }

  @Action(DialerDisconnected)
  onDisconnect() {}

  @Action(DialerLeadDisconnected)
  onLeadDisconnect({ dispatch }, { payload }: { payload: { phoneNumber: string } }) {
    if (this.config.dispositionCallAutomatically) {
      this.store.dispatch(new DialerHangUp());
    }
  }

  @Action(DialerReLogin)
  async onLogin({ dispatch, patchState }: StateContext<any>) {
    patchState({ loading: true });

    const { agent, extension } = this.store.selectSnapshot(UserState.getAgent);
    const { id: campaign } = this.store.selectSnapshot(DialerCampaignState.getActive);
    
    await dispatch(new CreateIframe({ agent, extension, campaign })).toPromise();

    this.dialerApiService
      .login({ agent, extension, campaign })
      .pipe(
        catchError(error => dispatch(new DialerLoginFailure(error))),
        finalize(() => patchState({ loading: false })),
      ).subscribe();
  }

  @Action(DialerLoginFailure)
  onLoginFailure({ dispatch }: StateContext<any>, { error }: DialerLoginFailure) {
    dispatch([
      new ShowError(error),
      new DialerLogout(false),
    ]);
  }

  @Action(CreateIframe)
  createIframe(ctx: StateContext<any>, { loginData }) {
    this.iframeService.create(loginData);
  }

  @Action(DestroyIframe)
  destroyIframe() {
    this.iframeService.destroy();
  }
}
