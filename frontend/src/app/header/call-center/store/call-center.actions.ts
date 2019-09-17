export class CallCenterHangUp {
  static readonly type = '[Call Center] HangUp';
}

export class CallCenterPause {
  static readonly type = '[Call Center] Pause';
  constructor(public payload: number) {}
}

export class CallCenterUnPause {
  static readonly type = '[Call Center] UnPause';
}
