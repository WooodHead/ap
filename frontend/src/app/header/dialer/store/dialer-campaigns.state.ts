import { State, Selector, Action, StateContext, Store } from '@ngxs/store';

import { DialerApiService } from '@dialer/services/dialer-api.service';
import { catchError, finalize, tap } from 'rxjs/internal/operators';
import {
  DialerGetCampaigns,
  DialerGetCampaignsFailure,
  DialerGetCampaignsSuccess,
  SetActiveCampaign,
  DetectedActiveCampaignChanged,
} from '@dialer/store/dialer-campaigns.actions';
import { UserState } from '@app/auth/store/user.state';
import { DialerCampaign, UserGroup } from '@dialer/models/campaign.model';
import {
  DialerLogin,
  DialerLoginFailure, DialerLogoutSuccess, CreateIframe,
} from '@dialer/store/dialer.actions';
import { ChangePanelMode } from '@app/panel/store/panel.actions';

export class DialerCampaignsStateModel {
  loading: boolean;
  active: DialerCampaign;
  list: DialerCampaign[];
  userGroup: UserGroup;
}

@State<DialerCampaignsStateModel>({
  name: 'campaigns',
  defaults: {
    loading: false,
    list: [],
    active: null,
    userGroup: {
      userGroup: '',
      campaigns: [],
    }
  },
})

export class DialerCampaignState {
  constructor(
    private store: Store,
    private dialerApi: DialerApiService,
  ) {}

  @Selector()
  static getLoading(state: DialerCampaignsStateModel) { return state.loading; }

  @Selector()
  static getList(state: DialerCampaignsStateModel) { return state.userGroup.campaigns; }

  @Selector()
  static getActive(state: DialerCampaignsStateModel) { return state.active; }

  @Selector()
  static getUserGroup(state: DialerCampaignsStateModel) { return state.userGroup}

  @Action(DialerGetCampaigns)
  onDialerGetCampaigns({ dispatch, patchState }: StateContext<DialerCampaignsStateModel>) {
    patchState({ loading: true });

    return this.dialerApi
      .getCampaigns()
      .pipe(
        tap(userGroup => dispatch(new DialerGetCampaignsSuccess(userGroup))),
        catchError(error => dispatch(new DialerGetCampaignsFailure(error))),
      );
  }

  @Action(DialerGetCampaignsSuccess)
  onDialerGetCampaignsSuccess(
    { patchState }: StateContext<DialerCampaignsStateModel>,
    { userGroup }: DialerGetCampaignsSuccess,
  ) {
    patchState({
      userGroup,
      list: userGroup.campaigns,
      loading: false,
    });
  }

  @Action(DialerLogin)
  async onLogin({ dispatch, patchState }: StateContext<any>, { campaign }: DialerLogin) {
    patchState({ loading: true });

    const { agent, extension } = this.store.selectSnapshot(UserState.getAgent);

    await dispatch(new CreateIframe({ agent, extension, campaign: campaign.id })).toPromise();
    
    this.dialerApi
      .login({
        agent,
        extension,
        campaign: campaign.id,
      })
      .pipe(
        tap(() => dispatch([
          new SetActiveCampaign(campaign),
          new ChangePanelMode(),
        ])),
        catchError(error => dispatch(new DialerLoginFailure(error))),
        finalize(() => patchState({ loading: false })),
      ).subscribe();
  }

  @Action(SetActiveCampaign)
  onSetActiveCampaign(
    { patchState }: StateContext<DialerCampaignsStateModel>,
    { campaign }: SetActiveCampaign,
  ) {
    patchState({ active: campaign });
  }

  @Action(DetectedActiveCampaignChanged)
  onDetectedActiveCampaignChanged(
    { dispatch, patchState }: StateContext<DialerCampaignsStateModel>,
    { payload } : DetectedActiveCampaignChanged,
  ) {
    const campaign = {
      ...payload,
      id: payload.campaign_id,
      name: payload.campaign_name
    };

    delete campaign.active;
    dispatch(new SetActiveCampaign(campaign));
  }
  

  @Action(DialerLogoutSuccess)
  onLogoutSuccess({ patchState }) {
    patchState({ active: null });
  }
}
