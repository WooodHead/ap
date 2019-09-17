import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { ViewType } from '@app/core/services/window/view.type';
import {
  ChangePanelView,
  OpenPanel,
  ChangePanelMode,
  PanelSetFromStorage,
  SetPanelOpened,
  SetPanelClosed,
  SetColumns,
  SetLastCall,
  RateCall,
  ResetPanelMode,
  ShowError,
} from '@app/panel/store/panel.actions';

import { PanelAPIService } from '@app/panel/services/panel-api.service';
import { ConfigService } from '@app/core/services/config/config.service';
import { UserState } from '@app/auth/store/user.state';
import { ChangeFormView } from '@app/auth/store/auth.actions';
import { WindowService } from '@app/core/services/window/window.service';
import { SnackBarService } from '@app/shared/components/vs-snackbar/snackbar.service';

export type PanelModeType = 'call-center' | 'dialer';

export class PanelStateModel {
  view: ViewType;
  isOpened: boolean;
  mode: PanelModeType;
  columns: any[];
  lastCall: {
    number: string;
    duration: number;
  };
}

@State<PanelStateModel>({
  name: 'panel',
  defaults: {
    view: 'horizontal',
    isOpened: false,
    mode: 'call-center',
    columns: [],
    lastCall: {
      number: null,
      duration: null,
    },
  },
})

export class PanelState {
  constructor(
    private store: Store,
    private config: ConfigService,
    private panelAPI: PanelAPIService,
    private windowService: WindowService,
    private snackBarService: SnackBarService,
  ) {}

  @Selector()
  static getView(state: PanelStateModel) { return state.view; }

  @Selector()
  static getOpened(state: PanelStateModel) { return state.isOpened; }

  @Selector()
  static getMode(state: PanelStateModel) { return state.mode || 'call-center'; }

  @Selector()
  static getColumns(state: PanelStateModel) { return state.columns; }

  @Selector()
  static getLastCall(state: PanelStateModel) { return state.lastCall; }

  private toggleModeState(state) {
    return state === 'dialer' ? 'call-center' : 'dialer';
  }

  private toggleViewState(state) {
    return state === 'horizontal' ? 'vertical' : 'horizontal';
  }

  @Action(PanelSetFromStorage)
  setState({ patchState }: StateContext<PanelStateModel>, { payload }: PanelSetFromStorage) {
    patchState({
      [payload.key]: payload.value,
    });
  }

  @Action(OpenPanel)
  openPanel(
      { patchState, getState, dispatch }: StateContext<PanelStateModel>,
      { payload }: OpenPanel,
    ) {
    const { isOpened } = getState();

    patchState({
      view: payload,
    });

    dispatch(new ChangeFormView(payload));
    this.windowService.open(payload, isOpened);
  }

  @Action(SetPanelOpened)
  setPanelOpened({ getState, patchState, dispatch }: StateContext<PanelStateModel>) {
    patchState({ isOpened: true });

    const { mode } = getState();
    dispatch(new SetColumns(mode));
  }

  @Action(SetPanelClosed)
  setPanelClosed({ patchState }: StateContext<PanelStateModel>) {
    patchState({ isOpened: false });
  }

  @Action(ChangePanelView)
  changeView({ getState, patchState }: StateContext<PanelStateModel>) {
    const { view: currentView } = getState();
    const view = this.toggleViewState(currentView);

    patchState({ view });

    const { view: panelView } = getState();
    this.windowService.changeView(panelView);
  }

  @Action(ResetPanelMode)
  onResetMode({ patchState }: StateContext<PanelStateModel>) {
    patchState({ mode: 'call-center' });
  }

  @Action(ChangePanelMode)
  changeMode({ getState, patchState, dispatch }: StateContext<PanelStateModel>) {
    const { mode: currentMode } = getState();
    const mode = this.toggleModeState(currentMode);

    patchState({ mode });
    dispatch(new SetColumns(mode));
  }

  @Action(SetColumns)
  setColumns(
    { getState, patchState }: StateContext<PanelStateModel>,
    { mode, shouldHide }: SetColumns,
  ) {
    // FIXME related to dialer logout from auth page
    if (!this.config.columns) {
      return;
    }

    let columns = this.config.columns[mode];

    if (shouldHide) {
      columns = columns.filter(c => !c.hide);
    }

    patchState({ columns });
  }

  @Action(SetLastCall)
  onSetLastCall({ patchState }: StateContext<PanelStateModel>, { number, duration }: SetLastCall) {
    patchState({
      lastCall: {
        number,
        duration,
      },
    });
  }

  @Action(RateCall)
  onRateCall({ getState }: StateContext<PanelStateModel>, { rate }: RateCall) {
    const { agent, extension } = this.store.selectSnapshot(UserState.getAgent);
    const { mode, lastCall } = getState();

    return this.panelAPI
      .rateCall({
        agent,
        extension,
        rate,
        mode,
        number: lastCall.number,
        duration: lastCall.duration,
      });
  }

  @Action(ShowError)
  onShowError({}, { error }: ShowError) {
    this.snackBarService.open(error);
  }
}
