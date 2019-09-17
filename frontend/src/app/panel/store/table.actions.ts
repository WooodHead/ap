export class UpdateTable {
  static readonly type = '[Agent Panel] Update Table';
}

export class UpdateQueueWaitingCalls {
  static readonly type = '[Agent Panel] Update Queue Waiting Calls';
  constructor(public payload: any) {}
}

export class ResetTimer {
  static readonly type = '[Agent Panel] Reset Timer';
}

export class UpdateData {
  static readonly type = '[Agent Panel] Update Data';
  constructor(public payload: any) {}
}

export class SetData {
  static readonly type = '[Agent Panel] Set Data';
  constructor(public payload: any) {}
}

export class SetDialerData {
  static readonly type = '[Agent Panel] Set Dialer Data';
  constructor(public payload: any) {}
}

export class UpdateTableItem {
  static readonly type = '[Agent Panel] Update table item';
  constructor(public payload: any) {}
}

export class ToggleLoading {
  static readonly type = '[Agent Panel] Toggle Loading';
  constructor(public loading: boolean) {}
}
