import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeAnimation } from '@app/shared/animations/fade.animation';

@Component({
  selector: 'app-webrtc-actions',
  templateUrl: './webrtc-actions.component.html',
  styleUrls: ['./webrtc-actions.scss'],
  animations: [fadeAnimation],
})
export class WebRTCActionsComponent {
  @Input() isInCall: boolean;
  @Input() isRinging: boolean;

  @Output() manualDial = new EventEmitter();
  @Output() answer = new EventEmitter();
  @Output() hold = new EventEmitter();
  @Output() showDialpad = new EventEmitter();
  @Output() showCallsHistory = new EventEmitter();
  @Output() showContacts = new EventEmitter();
}
