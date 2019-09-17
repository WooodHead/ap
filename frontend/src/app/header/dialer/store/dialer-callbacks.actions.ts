import { DialerCallback } from '@dialer/models/callback.model';

export class DialerGetCallbacks {
  static readonly type = '[Dialer] Get Callbacks';
}

export class DialerGetCallbacksSuccess {
  static readonly type = '[Dialer] Get Callbacks Success';
  constructor(public data: DialerCallback[]) {}
}

export class ActivateCallback {
  static readonly type = '[Dialer] Activate Callback';
  constructor(public callbackId: number) {}
}

export class RemoveCallback {
  static readonly type = '[Dialer] Remove Callback';
  constructor(public leadId: number) {}
}
