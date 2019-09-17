import { ViewType } from '@app/core/services/window/view.type';
import { PanelModeType } from '@app/panel/store/panel.state';

export class PanelSetFromStorage {
  static readonly type = '[Panel] Set from storage';
  constructor(public payload: any) { }
}

export class OpenPanel {
  static readonly type = '[Panel] Open panel';
  constructor(public payload?: ViewType) { }
}

export class SetPanelOpened {
  static readonly type = '[Panel] Set panel opened';
}

export class SetPanelClosed {
  static readonly type = '[Panel] Set panel closed';
}

export class ChangePanelView {
  static readonly type = '[Panel] Change view';
}

export class ChangePanelMode {
  static readonly type = '[Panel] Change mode';
}

export class ResetPanelMode {
  static readonly type = '[Panel] Reset mode';
}

export class SetColumns {
  static readonly type = '[Panel] Set columns';
  constructor(public mode: PanelModeType, public shouldHide = true) {}
}

export class SetLastCall {
  static readonly type = '[Panel] Set Last Call';
  constructor(public number: string, public duration: number) {}
}

export class RateCall {
  static readonly type = '[Panel] Rate Call';
  constructor(public rate: number) {}
}

export class OpenNotificator {
  static readonly type = '[Agent Panel] Open notificator';
}

export class ShowError {
  static readonly type = '[Agent Panel] Show Error';
  constructor(public error: any) {}
}

export class SetNotificator {
  static readonly type = '[Agent Panel] Set notificator';
}
