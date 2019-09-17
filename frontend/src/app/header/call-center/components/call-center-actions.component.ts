import { Component, ViewChild } from '@angular/core';
import { StatusService } from '@app/core/services/status/status.service';
import { ConfigService } from '@app/core/services/config/config.service';
import { Actions, Store } from '@ngxs/store';

import {
  CallCenterHangUp,
  CallCenterPause,
  CallCenterUnPause,
} from '@call-center/store/call-center.actions';
import { Logout } from '@app/auth/store/auth.actions';

import {
  AbstractHeaderActions,
} from '@app/header/header-actions.component';
import { fadeAnimation } from '@app/shared/animations/fade.animation';
import { MatSlideToggle } from '@angular/material';
import { ModalService } from '@app/shared/modals';
import { DialerCampaignModalComponent } from '@call-center/modals/components';
import { HeaderActionsService } from '@app/header/services/header-actions.service';
import { WebRTCService } from '@app/core/services/web-rtc/web-rtc.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-call-center-actions',
  templateUrl: './call-center-actions.component.html',
  styleUrls: ['./call-center-actions.scss'],
  animations: [fadeAnimation],
  // FIXME
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallCenterActionsComponent extends AbstractHeaderActions {
  config: ConfigService;
  showAnswer$ = this.status$.pipe(map(s => this.showAnswer(s)));

  @ViewChild(MatSlideToggle) slideToggle;

  constructor(
    private statusService: StatusService,
    private modalService: ModalService,
    private webRTCService: WebRTCService,
    store: Store,
    actions$: Actions,
    config: ConfigService,
    headerActionsService: HeaderActionsService,
  ) {
    super(
      store,
      actions$,
      config,
      headerActionsService,
    );
  }

  onSwitchMode() {
    return this.modalService
      .open(
        DialerCampaignModalComponent, {
          width: '500px',
        },
      )
      .subscribe(dialerSet => this.slideToggle.checked = !!dialerSet);
  }

  loginDisabled(status) {
    return false;
  }

  showHangUp(status) {
    return this.statusService.check('isInCall', status);
  }

  showPause(status) {
    return !this.showUnPause(status);
  }

  showAnswer(status) {
    return this.statusService.check('isRinging', status);
  }

  showUnPause(status): boolean {
    return this.config
      .pauses
      .some(({ pauseReason }) => pauseReason === status);
  }

  dial({ phoneNumber }) {
    this.webRTCService.call(phoneNumber);
  }

  transfer({ phoneNumber }) {
    this.webRTCService.transfer(phoneNumber);
  }

  onHold() {
    this.webRTCService.hold();
  }

  onLogout() {
    this.store.dispatch(new Logout());
  }

  onPause(pauseCode: number) {
    this.store.dispatch(new CallCenterPause(pauseCode));
  }

  onUnPause() {
    this.store.dispatch(new CallCenterUnPause());
  }

  // FIXME not terminating incoming webrtc call (webrtc.hangup doesn't work as well)
  onHangUp() {
    this.store.dispatch(new CallCenterHangUp());
  }

  onAnswer() {
    this.webRTCService.answer();
  }

  showAnswerMachine() {
    return true;
  }

}
