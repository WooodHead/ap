import { Injectable } from '@angular/core';
import { Actions, ofActionDispatched, ofActionSuccessful, Store } from '@ngxs/store';
import {
  ChangePanelMode,
  SetPanelOpened,
} from '@app/panel/store/panel.actions';
import { PanelState } from '@app/panel/store/panel.state';
import {
  ResetTimer,
  SetData,
  SetDialerData, ToggleLoading,
  UpdateTable,
} from '@app/panel/store/table.actions';
import { SocketMessageService } from '@app/core/services/socket-message.service';
import { UserState } from '@app/auth/store/user.state';
import {
  DialerLogin,
  DialerLoginFailure,
  DialerLogout,
  DialerLogoutFailure, DialerLogoutSuccess, DialerReLogin,
} from '@dialer/store/dialer.actions';

@Injectable()
export class ActionsHandler {
  private interval;

  constructor(
    private actions$: Actions,
    private store: Store,
    private socketMsgService: SocketMessageService,
  ) {

    this.actions$
      .pipe(
        ofActionSuccessful(SetData, SetDialerData, ResetTimer),
      )
      .subscribe(() => this.initTimer());

    this.actions$
      .pipe(
        ofActionSuccessful(ChangePanelMode, SetPanelOpened),
      )
      .subscribe(() => this.initSocket());

    this.actions$
      .pipe(
        ofActionDispatched(DialerLogin, DialerReLogin,  DialerLogout),
      )
      .subscribe(() => this.toggleTable(true));

    this.actions$
      .pipe(
        ofActionDispatched(DialerLoginFailure, DialerLogoutFailure, DialerLogoutSuccess),
      )
      .subscribe(() => this.toggleTable(false));

  }

  private initTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => this.store.dispatch(new UpdateTable()), 1000);
  }

  private initSocket() {
    const agent = this.store.selectSnapshot(UserState.getAgentId);
    const mode = this.store.selectSnapshot(PanelState.getMode);

    this.socketMsgService.listen({ agent, mode });
  }

  private toggleTable(shouldShow) {
    this.store.dispatch(new ToggleLoading(shouldShow));
  }
}
