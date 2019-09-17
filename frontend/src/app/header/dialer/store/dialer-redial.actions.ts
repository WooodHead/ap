import { DialerRedial } from '@dialer/models/redial.model';

export class DialerGetRedial {
  static readonly type = '[Dialer] Get Redial';
}

export class DialerGetRedialSuccess {
  static readonly type = '[Dialer] Get Redial Success';
  constructor(public data: DialerRedial) {}
}
