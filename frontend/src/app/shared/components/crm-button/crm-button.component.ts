import { Component, OnInit, OnDestroy } from '@angular/core';
import { ofActionDispatched, ofActionSuccessful, Actions } from '@ngxs/store';
import { filter, tap, takeUntil } from 'rxjs/operators';
import { OpenNotificator, ChangePanelMode } from '@app/panel/store/panel.actions';
import { ConfigService } from '@app/core/services/config/config.service';
import { NotificatorService } from '@app/core/services/notificator/notificator.service';
import {
  BrowserNotificatorService,
} from '@app/core/services/notificator/browser-notificator.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-crm-button',
  templateUrl: './crm-button.component.html',
  styleUrls: ['./crm-button.component.scss'],
})
export class CrmButtonComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();

  constructor(
    public notificator: NotificatorService,
    private browserNotificator: BrowserNotificatorService,
    private actions$: Actions,
    private config: ConfigService,
  ) { }

  ngOnInit(): void {
    this.browserNotificator.checkPermission();

    const openNotificator$ = this.actions$.pipe(
      ofActionDispatched(OpenNotificator),
      takeUntil(this.destroyed$),
      tap(action => this.notificator.setUrl(action.payload)),
    );

    openNotificator$
      .pipe(
        filter(() => this.config.notificator.autoOpen),
      )
      .subscribe(() => this.notificator.open());

    openNotificator$
      .pipe(
        filter(() => this.config.notificator.message),
      )
      .subscribe(action => this.browserNotificator.notify(action.payload));

    this.actions$
      .pipe(
        ofActionSuccessful(ChangePanelMode),
      )
      .subscribe(() => this.notificator.resetUrl());
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
