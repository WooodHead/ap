import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  WebRTCSetCaller,
  WebRTCSetStatus,
  WebRTCSetConfig,
} from '@app/header/store/webrtc.actions';

export class WebRTCStateModel {
  status: string;
  caller: string;
  config: WebRTCConfig;
}

export interface WebRTCConfig {
  uri: string;
  password: string;
  socket: string;
}

@State<WebRTCStateModel>({
  name: 'webrtc',
  defaults: {
    status: null,
    caller: null,
    config: null,
  },
})

export class WebRTCState {
  @Selector()
  static getStatus(state: WebRTCStateModel) { return state.status; }

  @Selector()
  static getCaller(state: WebRTCStateModel) { return state.caller; }

  @Selector()
  static getConfig(state: WebRTCStateModel) { return state.config; }

  @Action(WebRTCSetStatus)
  onSetStatus(
    { patchState, dispatch }: StateContext<WebRTCStateModel>,
    { status }: WebRTCSetStatus,
  ) {
    patchState({ status });
  }

  @Action(WebRTCSetCaller)
  onSetCaller(
    { patchState }: StateContext<WebRTCStateModel>,
    { caller }: WebRTCSetCaller,
  ) {
    patchState({ caller });
  }

  @Action(WebRTCSetConfig)
  onGetConfig(
    { patchState }: StateContext<WebRTCStateModel>,
    { config }: WebRTCSetConfig,
  ) {
    patchState({ config });
  }
}
