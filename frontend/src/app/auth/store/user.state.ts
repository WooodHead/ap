import { Action, Selector, State, StateContext } from '@ngxs/store';

import { Agent } from '@app/auth/models/agent.model';
import { LoginSuccess, LogoutSuccess } from '@app/auth/store/auth.actions';
import { WebRTCSetConfig } from '@app/header/store/webrtc.actions';
import { environment } from '@env/environment';
import { WebRTCConfig } from '@app/header/store/webrtc.state';

export interface UserStateModel {
  agent: Agent;
  useWebRTC: boolean;
  isLoggedIn: boolean;
  sid: string;
}

const INITIAL_STATE = {
  agent: null,
  useWebRTC: null,
  isLoggedIn: false,
  sid: Math.random().toString(32).slice(2),
};

@State<UserStateModel>({
  name: 'user',
  defaults: INITIAL_STATE,
})
export class UserState {
  @Selector()
  static getLoggedIn(state: UserStateModel) { return state.isLoggedIn; }

  @Selector()
  static getAgent(state: UserStateModel) { return state.agent; }

  @Selector()
  static getUseWebRTC(state: UserStateModel) { return state.useWebRTC; }

  @Selector()
  static getAgentId(state: UserStateModel) { return state.agent.agent; }

  @Selector()
  static getSid(state: UserStateModel) { return state.sid; }
​
  @Action(LoginSuccess)
  loginSuccess(
    { patchState, dispatch }: StateContext<UserStateModel>,
    { agent, submittedForm }: LoginSuccess) {

    patchState({
      agent,
      useWebRTC: submittedForm.useWebRTC,
      isLoggedIn: true,
    });

    const webRtcConfig: WebRTCConfig = {
      uri: `sip:${agent.extension}@${environment.socketDomain}`,
      socket: environment.socket,
      password: submittedForm.secret,
    };

    dispatch(
      new WebRTCSetConfig(webRtcConfig),
    );
  }
​
  @Action(LogoutSuccess)
  logout({ patchState }: StateContext<UserStateModel>) {    
    patchState({
      agent: INITIAL_STATE.agent,
      isLoggedIn: INITIAL_STATE.isLoggedIn,
    });
  }
}
