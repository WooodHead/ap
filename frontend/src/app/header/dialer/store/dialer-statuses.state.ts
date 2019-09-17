import { State, Selector, Action, StateContext, Store } from '@ngxs/store';

import { DialerApiService } from '@dialer/services/dialer-api.service';
import { catchError, tap } from 'rxjs/internal/operators';
import {
  DialerGetStatuses,
  DialerGetStatusesFailure,
  DialerGetStatusesSuccess,
} from '@dialer/store/dialer-statuses.actions';
import { DialerCampaign } from '@dialer/models/campaign.model';

export class DialerStatusStateModel {
  loading: boolean;
  list: DialerCampaign[];
}

@State<DialerStatusStateModel>({
  name: 'statuses',
  defaults: {
    loading: false,
    list: [],
  },
})

export class DialerStatusState {
  constructor(
    private store: Store,
    private dialerApi: DialerApiService,
  ) {}

  @Selector()
  static getLoading(state: DialerStatusStateModel) { return state.loading; }

  @Selector()
  static getList(state: DialerStatusStateModel) { return state.list; }

  @Action(DialerGetStatuses)
  onDialerGetStatuses({ dispatch, patchState }: StateContext<DialerStatusStateModel>) {
    patchState({ loading: true });

    return this.dialerApi
      .getStatuses()
      .pipe(
        tap(statuses => dispatch(new DialerGetStatusesSuccess(statuses))),
        catchError(error => dispatch(new DialerGetStatusesFailure(error))),
      );
  }

  @Action(DialerGetStatusesSuccess)
  onDialerGetCampaignsSuccess(
    { patchState }: StateContext<DialerStatusStateModel>,
    { list }: DialerStatusStateModel,
  ) {
    patchState({
      list,
      loading: false,
    });
  }
}
