import {
  State,
  Action,
  StateContext,
  Selector, Store, ofActionDispatched, Actions,
} from '@ngxs/store';

import {
  UpdateTable,
  UpdateData,
  SetData,
  ResetTimer,
  UpdateTableItem,
  SetDialerData,
  ToggleLoading,
  UpdateQueueWaitingCalls,
} from '@app/panel/store/table.actions';

import { TransformDataService } from '@app/panel/services/transform-data.service';
import { SnackBarRateService } from '@app/shared/components/vs-snackbar-rate/snackbar-rate.service';
import { ChangePanelMode, SetColumns, SetLastCall } from '@app/panel/store/panel.actions';
import { StatusService } from '@app/core/services/status/status.service';
import {
  DialerSetShowDispoModal,
  DialerShowDispoModal,
  SetLead,
} from '@dialer/store/dialer.actions';
import { PanelState } from '@app/panel/store/panel.state';
import { DialerState } from '@dialer/store/dialer.state';
import { delay, takeUntil } from 'rxjs/internal/operators';
import { of } from 'rxjs/index';
export class TableStateModel {
  shouldShow: boolean;
  data: any;
  queues: any;
  loading: boolean;
}

@State<TableStateModel>({
  name: 'table',
  defaults: {
    shouldShow: true,
    data: null,
    queues: null,
    loading: true,
  },
})

export class TableState {
  constructor(
    private store: Store,
    private dataService: TransformDataService,
    private statusService: StatusService,
    private actions$: Actions,
    private snackBarRateService: SnackBarRateService,
  ) {}

  @Selector()
  static getLoading(state: TableStateModel) { return state.loading; }

  @Selector()
  static getData(state: TableStateModel) { return state.data; }

  @Selector()
  static getQueues(state: TableStateModel) { return state.queues; }

  @Selector()
  static getStatus(state: TableStateModel) { return state.data.Status; }

  @Action(UpdateTable)
  onUpdateTable({ getState }: StateContext<TableStateModel>) {
    // FIXME queues and table are mutable, state update even without patch/set state
    const { queues, data } = getState();
    this.dataService.updateLiveColumns(data, queues);
  }

  @Action(UpdateQueueWaitingCalls)
  onUpdateQueueWaitingCalls(
    { getState, patchState }: StateContext<TableStateModel>,
    { payload }: UpdateQueueWaitingCalls,
    ) {
    const { data, queues } = getState();

    data.WaitingCalls += payload.WaitingCalls - (queues[payload.Queue].WaitingCalls || 0);
    queues[payload.Queue].WaitingCalls = payload.WaitingCalls;
  }

  @Action(UpdateData)
  onUpdateData(
    { dispatch, patchState, setState, getState }: StateContext<TableStateModel>,
    { payload }: UpdateData,
  ) {
    const { queues, data: currentData } = getState();

    // 1. no update if agent status is same
    // could be when only ext. status changed from busy to ok but agent's status still talkout

    // 2. when calling to internal queue 2 events come with same statuses
    // only FromQueue, TalkingTo and CalledID changed
    if (
      payload.Status === queues[payload.Queue].Status &&
      payload.FromQueue === queues[payload.Queue].FromQueue
    ) {
      return;
    }

    // FIXME test version: change logic (ugly) and refactor in general
    // FIXME each agent's queue triggers opening
    if (this.statusService.shouldShowRateSnackbar(payload.Status, currentData.Status)) {
      const number = queues[payload.Queue].TalkingTo;
      const duration = currentData.StatusTime;

      // FIXME get from config
      if (duration > 20) {
        dispatch(new SetLastCall(number, duration));
        this.snackBarRateService.open();
      }
    }

    // FIXME queues are mutable, state update even without patch/set state
    payload.WaitingCalls = queues[payload.Queue].WaitingCalls;
    queues[payload.Queue] = payload;

    const data = this.dataService.sumTableData(Object.values(queues));

    patchState({ data });

    dispatch(new ResetTimer());
  }

  @Action(SetData)
  onSetData(
    { patchState }: StateContext<TableStateModel>,
    { payload }: SetData,
  ) {
    const queues = this.dataService.normalizeQueues(payload);
    const data = this.dataService.sumTableData(payload);

    patchState({ queues, data, loading: false });
  }

  @Action(SetDialerData)
  onSetDialerData(
    { getState, patchState, dispatch }: StateContext<TableStateModel>,
    { payload }: SetData,
  ) {
    if (!payload) {
      dispatch(new ChangePanelMode());
      return;
    }

    return of(null)
      .pipe(
        delay(250),
        takeUntil(this.actions$.pipe(ofActionDispatched(SetDialerData))),
      )
      .subscribe(() => {
        const { data: currentData } = getState();

        if (
          currentData
          && this.statusService.shouldShowDispoModal(payload.Status, currentData.Status)
        ) {
          this.store
            .selectOnce(DialerState.getShouldShowDispo)
            .subscribe((shouldShowDispo) => {
              if (shouldShowDispo) {
                dispatch(new DialerShowDispoModal());
              } else {
                dispatch(new DialerSetShowDispoModal());
              }
            });
        }

        // FIXME test version: change logic (ugly) and refactor in general
        // FIXME each agent's queue triggers opening
        if (currentData) {
          if (this.statusService.shouldShowRateSnackbar(payload.Status, currentData.Status)) {
            const number = currentData.phone_number;
            const duration = currentData.last_state_change;

            // FIXME get from config
            if (duration > 20) {
              dispatch(new SetLastCall(number, duration));
              this.snackBarRateService.open();
            }
          }
        }

        dispatch(new SetColumns('dialer', payload.Status !== 'INCALL')).subscribe(() => {
          if (
            currentData
            && this.statusService.shouldSetLead(payload.Status, currentData.Status)
          ) {
            // FIXME
            const leadData = this.store
              .selectSnapshot(PanelState.getColumns)
              .filter(column => column.editable)
              .reduce((a, column) => {
                a[column.key] = payload[column.key];

                return a;
              },      {});

            leadData.phone_number = payload.phone_number;
            leadData.lead_id = payload.lead_id;

            dispatch(new SetLead(leadData));
          }
        });

        const data = this.dataService.sumTableData([payload]);

        patchState({ data, loading: false });
      });
  }

  @Action(UpdateTableItem)
  onUpdateTableItem(
    { patchState, getState }: StateContext<TableStateModel>,
    { payload }: UpdateTableItem,
  ) {
    const state = getState();

    patchState({
      data: {
        ...state.data,
        ...payload,
      },
    });
  }

  @Action(ToggleLoading)
  onHideTable({ patchState }: StateContext<TableStateModel>, { loading }: ToggleLoading) {
    patchState({ loading });
  }
}
