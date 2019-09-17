import { WebRTCConfig } from './webrtc.state';

export class WebRTCSetStatus {
  static readonly type = '[WebRTC] Set status';
  constructor(public status: string) {}
}

export class WebRTCSetCaller {
  static readonly type = '[WebRTC] Set caller';
  constructor(public caller: string) {}
}

export class WebRTCSetConfig {
  static readonly type = '[WebRTC] Set Config';
  constructor(public config: WebRTCConfig) {}
}
