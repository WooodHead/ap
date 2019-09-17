import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Agent } from '@app/auth/models/agent.model';
import { PanelModeType } from '@app/panel/store/panel.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() agent: Agent;
  @Input() mode: PanelModeType;
  @Input() version: string;
  @Input() isWebRTC: string;
  @Input() caller: string;
  @Input() status: string;

  @Output() webRTCReconnect = new EventEmitter();
}
