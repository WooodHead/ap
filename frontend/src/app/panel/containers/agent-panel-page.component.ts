import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';

import { Store, Select } from '@ngxs/store';
import { PanelState } from '@app/panel/store/panel.state';
import {
  SetPanelClosed,
  SetPanelOpened,
} from '@app/panel/store/panel.actions';

import { ConfigService } from '@app/core/services/config/config.service';
import { TableState } from '@app/panel/store/table.state';
import { UserState } from '@app/auth/store/user.state';
import { fadeAnimation } from '@app/shared/animations/fade.animation';
import { WebRTCService } from '@app/core/services/web-rtc/web-rtc.service';
import { WebRTCState } from '@app/header/store/webrtc.state';

@Component({
  selector: 'vs-agent-panel',
  styleUrls: ['./agent-panel.component.scss'],
  templateUrl: './agent-panel-page.component.html',
  animations: [fadeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentPanelPageComponent implements OnInit {
  @Select(UserState.getAgent) agent$;
  @Select(UserState.getUseWebRTC) useWebRTC$;
  @Select(TableState.getData) tableData$;
  @Select(TableState.getLoading) tableLoading$;
  @Select(PanelState.getView) panelView$;
  @Select(PanelState.getMode) mode$;
  @Select(PanelState.getColumns) columns$;
  @Select(WebRTCState.getCaller) caller$;
  @Select(WebRTCState.getStatus) status$;

  @HostListener('window:unload', ['$event'])
  unloadHandler() {
    this.store.dispatch(new SetPanelClosed());
    if (this.config.webrtc) {
      this.webRTCService.logout();
    }
  }

  constructor(
    private store: Store,
    private webRTCService: WebRTCService,
    public config: ConfigService,
  ) {}

  ngOnInit() {
    this.store.dispatch(new SetPanelOpened());

    if (this.config.webrtc) {
      this.useWebRTC$.subscribe(useWebRTC => useWebRTC && this.webRTCService.login());
    }
  }

  onWebRTCReconnect() {
    this.webRTCService.reconnect();
  }
}
