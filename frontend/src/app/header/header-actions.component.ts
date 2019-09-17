import { OnInit, OnDestroy } from '@angular/core';
import { Actions, Select, Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { PanelModeType, PanelState } from '@app/panel/store/panel.state';
import { ChangePanelView } from '@app/panel/store/panel.actions';
import { Observable, Subject } from 'rxjs';
import { TableState } from '@app/panel/store/table.state';
import { ConfigService } from '@app/core/services/config/config.service';
import { HeaderActionsService } from '@app/header/services/header-actions.service';
import { UserState } from '@app/auth/store/user.state';
import { LayoutState } from '@app/core/store/layout.state';
import { CallsHistoryModalComponent } from '@app/header/modals/calls-history/calls-history-modal.component';

export abstract class AbstractHeaderActions implements OnInit, OnDestroy {
  @Select(TableState.getStatus) status$;
  @Select(PanelState.getMode) mode$;
  @Select(PanelState.getView) panelView$;
  @Select(LayoutState.getIsSmallScreen) isSmallScreen$;
  @Select(TableState.getLoading) tableLoading$;
  @Select(UserState.getUseWebRTC) useWebRTC$;

  showPause$: Observable<boolean>;
  showHangUp$: Observable<boolean>;
  loginDisabled$: Observable<boolean>;

  destroyed$ = new Subject();

  constructor(
    protected store: Store,
    protected actions$: Actions,
    public config: ConfigService,
    private headerActionsService: HeaderActionsService,
  ) { }

  ngOnInit(): void {
    this.showPause$ = this.status$.pipe(
      map(this.showPause.bind(this)),
    );

    this.showHangUp$ = this.status$.pipe(
      map(this.showHangUp.bind(this)),
    );

    this.loginDisabled$ = this.status$.pipe(
      map(this.loginDisabled.bind(this)),
    )
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onChangeView(): void {
    this.store.dispatch(new ChangePanelView());
  }

  onShowDialpad() {
    this.headerActionsService.showDialpad();
  }

  onManualDial(type) {
    this.headerActionsService
      .manualDial(type)
      .subscribe((res) => {
        switch (type) {
          case 'transfer':
            this.transfer(res);
            break;

          default:
            this.dial(res);
        }
      });
  }

  onShowCallsHistory() {
    this.headerActionsService.showCallsHistory();
  }

  onShowContacts() {
    this.headerActionsService.showContacts();
  }

  abstract dial(data: any): void;

  abstract transfer(data: any): void;

  abstract showPause(status: string): boolean;

  abstract loginDisabled(status: string): boolean;

  abstract showAnswerMachine(status: string): boolean;

  abstract showHangUp(status: string): boolean;

  abstract onUnPause(): void;

  abstract onLogout(): void;

}
