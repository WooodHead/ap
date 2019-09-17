import { DialerStatus } from '@dialer/models/status.model';

export class DialerGetStatuses {
  static readonly type = '[Dialer] Get Statuses';
}

export class DialerGetStatusesSuccess {
  static readonly type = '[Dialer] Get Statuses Success';
  constructor(public list: DialerStatus[]) {}
}

export class DialerGetStatusesFailure {
  static readonly type = '[Dialer] Get Statuses Failure';
  constructor(public error: any) {}
}
