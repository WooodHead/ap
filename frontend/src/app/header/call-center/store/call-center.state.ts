import { State, Action, Store } from '@ngxs/store';
import {
	CallCenterHangUp,
	CallCenterPause,
	CallCenterUnPause,
} from '@call-center/store/call-center.actions';
import { CallCenterService } from '@call-center/services/call-center-api.service';
import { UserState } from '@app/auth/store/user.state';

@State({
  name: 'callCenter',
})
export class CallCenterState {
  constructor(private callCenterService: CallCenterService, private store: Store) {}

  @Action(CallCenterHangUp)
  onHangUp() {
    const extension = this.store.selectSnapshot(UserState.getAgent).extension;
    return this.callCenterService.hangUp({ extension });
  }

  @Action(CallCenterPause)
	onPause({}, { payload }: CallCenterPause) {
    const agent = this.store.selectSnapshot(UserState.getAgent).agent;

    return this.callCenterService.pause({
      agent,
      pauseCode: payload,
    });
  }

  @Action(CallCenterUnPause)
	onUnPause() {
    const agent = this.store.selectSnapshot(UserState.getAgent).agent;
    return this.callCenterService.unpause({ agent });
  }

}
