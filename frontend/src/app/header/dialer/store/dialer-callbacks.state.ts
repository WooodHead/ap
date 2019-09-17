import { State, Action, Store, Selector } from '@ngxs/store';
import { catchError, finalize, tap } from 'rxjs/internal/operators';
import { timer, Subscription } from 'rxjs';

import {
  DialerGetCallbacks,
  DialerGetCallbacksSuccess,
  RemoveCallback,
  ActivateCallback,
} from '@dialer/store/dialer-callbacks.actions';
import { DialerApiService } from '@dialer/services/dialer-api.service';
import { DialerCallback } from '@dialer/models/callback.model';
import { ShowError } from '@app/panel/store/panel.actions';

export interface DialerCallbacksStateModel {
  loading: boolean;
  data: DialerCallback[];
  active: number;
}

@State<DialerCallbacksStateModel>({
  name: 'callbacks',
  defaults: {
    loading: false,
    data: [],
    active: null,
  },
})
export class DialerCallbacksState {

  private timerSubscription: Subscription;

  constructor(
    private dialerApiService: DialerApiService,
    private store: Store,
  ) {}

  @Selector()
  static getActive(state) { return state.active; }

  @Selector()
  static getData(state) { return state.data; }

  @Selector()
  static getLoading(state) { return state.loading; }

  @Action(DialerGetCallbacks)
  onDialerGetCallbacks({ patchState, dispatch }) {
    patchState({ loading: true });

    return this.dialerApiService
      .getCallbacks()
      .pipe(
        tap(data => dispatch(new DialerGetCallbacksSuccess(data))),
        catchError(error => dispatch(new ShowError(error))),
        finalize(() => patchState({ loading: false })),
      );
  }

  @Action(DialerGetCallbacksSuccess)
  onDialerGetCallbacksSuccess({ patchState }, { data }: DialerGetCallbacksSuccess) {
    const active = data.filter(c => c.active).length;

    patchState({
      data,
      active,
    });

    this.initCallbackTimer();
  }

  @Action(ActivateCallback)
  onActivateCallback({ getState, patchState }, { callbackId }: ActivateCallback) {
    const { data, active } = getState();

    const callbackIndex = data.findIndex(c => c.callbackId === callbackId);

    data[callbackIndex].active = true;

    patchState({
      data,
      active: active + 1,
    });
  }

  @Action(RemoveCallback)
  onRemoveCallback({ getState, patchState }, { leadId }: RemoveCallback) {
    const { data, active } = getState();

    const callbackIndex = data.findIndex(c => c.leadId === leadId);

    if (callbackIndex === -1) return;

    if (data[callbackIndex].active) {
      const newActive = active === 1 ? null : active - 1;

      patchState({ active: newActive });
    }

    data.splice(callbackIndex, 1);

    patchState({ data });
  }

  private initCallbackTimer() {
    // start timer from first second next minute
    const startTimerSeconds = 60 - new Date().getSeconds();

    if(this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = timer(startTimerSeconds * 1000, 60000).subscribe(() => {
      const now = new Date();

      const data = this.store
        .selectSnapshot<DialerCallback[]>((state: any) => state.dialer.callbacks.data);

      data
        .filter(c => !c.active)
        .forEach((callback) => {
          if (new Date(callback.datetime) <= now) {
            this.store.dispatch(new ActivateCallback(callback.callbackId));
          }
        });   
    });
  }
}
