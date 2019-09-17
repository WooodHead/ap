import { State, Action, Store, Selector } from '@ngxs/store';
import {
  DialerGetRedial,
  DialerGetRedialSuccess,
} from '@dialer/store/dialer-redial.actions';
import { DialerApiService } from '@dialer/services/dialer-api.service';

import { UserState } from '@app/auth/store/user.state';
import { DialerRedial } from '@dialer/models/redial.model';
import { catchError, finalize, tap } from 'rxjs/internal/operators';
import { ShowError } from '@app/panel/store/panel.actions';

export interface DialerRedialStateModel {
  loading: boolean;
  data: DialerRedial;
}

@State<DialerRedialStateModel>({
  name: 'redial',
  defaults: {
    loading: false,
    data: null,
  },
})
export class DialerRedialState {
  constructor(
    private dialerApiService: DialerApiService,
    private store: Store,
  ) {}

  @Selector()
  static getFullName(state) {
    if (!state.data.firstName && !state.data.lastname) {
      return null;
    }

    return `${state.data.firstName} ${state.data.lastName}`;
  }

  @Selector()
  static getData(state) { return state.data; }

  @Selector()
  static getLoading(state) { return state.loading; }

  @Action(DialerGetRedial)
  onDialerGetRedial({ patchState, dispatch }) {
    patchState({ loading: true });

    return this.dialerApiService
      .getRedial()
      .pipe(
        tap(data => dispatch(new DialerGetRedialSuccess(data))),
        catchError(error => dispatch(new ShowError(error))),
        finalize(() => patchState({ loading: false })),
      );
  }

  @Action(DialerGetRedialSuccess)
  onDialerGetRedialSuccess({ patchState, dispatch }, { data }: DialerGetRedialSuccess) {
    if (!data) {
      dispatch(new ShowError('panel.dialer.no-redial'));
    }

    patchState({ data });
  }
}
