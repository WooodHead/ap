import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import {
  DialerHangUp,
  DialerLogout,
  DialerPause,
  DialerShowDispoModal,
  DialerTransfer,
  DialerUnPause,
  DialerDial,
  DialerHold,
  DialerDisconnected,
  DialerQuickHangUp,
  DialerReLogin,
} from '@dialer/store/dialer.actions';
import { StatusService } from '@app/core/services/status/status.service';
import {
  AbstractHeaderActions,
} from '@app/header/header-actions.component';
import { DialerActionsService } from '@dialer/services/dialer-actions.service';
import { fadeAnimation } from '@app/shared/animations/fade.animation';
import { DialerState } from '@dialer/store/dialer.state';
import { DialerCampaignState } from '@dialer/store/dialer-campaigns.state';
import { MatSlideToggle } from '@angular/material';
import { DialerGetCallbacks } from '@dialer/store/dialer-callbacks.actions';
import { DialerCallbacksState } from '@dialer/store/dialer-callbacks.state';
import { Dial } from '@dialer/models/dial.model';
import { filter, share, switchMap, takeUntil, tap, delay } from 'rxjs/internal/operators';
import { merge, Subject } from 'rxjs/index';
import { Logout } from '@app/auth/store/auth.actions';

import { ConfigService } from '@app/core/services/config/config.service';
import { DialerGetStatuses } from '@dialer/store/dialer-statuses.actions';
import { HeaderActionsService } from '@app/header/services/header-actions.service';
import { DialerGetCampaigns } from '../store/dialer-campaigns.actions';

@Component({
  selector: 'app-dialer-actions',
  templateUrl: './dialer-actions.component.html',
  styleUrls: ['./dialer-actions.scss'],
  animations: [fadeAnimation],
})
export class DialerActionsComponent extends AbstractHeaderActions implements OnDestroy, OnInit {
  @Select(DialerState.getLoading) loading$;
  @Select(DialerCampaignState.getActive) campaign$;
  @Select(DialerCallbacksState.getActive) activeCallbacks$;
  @Select(DialerCampaignState.getUserGroup) userGroup$;
  @Select(DialerState.getOnHold) onHold$;

  @ViewChild(MatSlideToggle) slideToggle;

  destroy$ = new Subject<boolean>();

  constructor(
    private statusService: StatusService,
    private dialerService: DialerActionsService,
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

    actions$
      .pipe(
        takeUntil(this.destroy$),
        ofActionSuccessful(DialerShowDispoModal),
      )
      .subscribe(() => this.dialerService.showDispoModal());

    const disconnected$ = actions$.pipe(
      takeUntil(this.destroy$),
      ofActionSuccessful(DialerDisconnected),
      switchMap(() => this.dialerService.showDisconnectModal()),
      share(),
    );

    const reLogin$ = disconnected$.pipe(
      filter(shouldReLogin => !!shouldReLogin),
      tap(() => this.store.dispatch(new DialerReLogin())),
    );

    const switchToCallCenter$ = disconnected$.pipe(
      filter(shouldReLogin => !shouldReLogin),
      tap(() => this.store.dispatch(new DialerLogout())),
    );

    merge(reLogin$, switchToCallCenter$).subscribe();

    store.dispatch(new DialerGetCallbacks());
    store.dispatch(new DialerGetStatuses());
  }

  showPause(status) {
    return this.statusService.check('isDialerReady', status);
  }

  showHangUp(status) {
    return this.statusService.check('isDialerInCall', status);
  }

  showAnswerMachine() {
    return !(this.config.agentPanel 
      && this.config.agentPanel.actions 
      && this.config.agentPanel.actions.dialer)
      || this.config.agentPanel.actions.dialer.showAnswerMachine;
  }

  loginDisabled(status) {
    return this.showHangUp(status);
  }

  onLogout() {
    this.store.dispatch(new Logout());
  }

  onSwitchMode() {
    this.dialerService
      .switchToCallCenter()
      .subscribe((callCenterSet) => {
        if (!callCenterSet) {
          this.slideToggle.checked = true;
          return;
        }

        this.store.dispatch(new DialerLogout());
      });
  }

  onShowCallbacks() {
    this.dialerService
      .showCallbacks()
      .subscribe(this.dial.bind(this));
  }

  onHangUp() {
    this.store.dispatch(new DialerHangUp());
  }

  onQuickHangUp() {
    this.store.dispatch(new DialerQuickHangUp());
  }

  onPause(pauseCode: number) {
    const { user: { agent: { agent } } } = this.store.snapshot();
    this.store.dispatch(new DialerPause({ agent, pauseCode }));
  }

  onUnPause() {
    const { user: { agent: { agent } } } = this.store.snapshot();
    this.store.dispatch(new DialerUnPause({ agent }));
  }

  redial() {
    this.dialerService.redial().subscribe(this.dial.bind(this));
  }

  dial(data: Dial) {
    this.store.dispatch(new DialerDial(data));
  }
 
  transfer(data: Dial) {
    this.store.dispatch(new DialerTransfer(data));
  }

  ngOnInit() {
    super.ngOnInit();
    const campaigns = this.store.selectSnapshot(DialerCampaignState.getList);

    if(campaigns || !campaigns.length) {
      this.store.dispatch(new DialerGetCampaigns());
    }
  }

  onHold() {
    this.store.dispatch(new DialerHold());
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
