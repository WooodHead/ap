import { DialerCampaign } from '@dialer/models/campaign.model';
import { Lead } from '@dialer/models/lead.model';

export class DialerSetFromStorage {
  static readonly type = '[Dialer] Set From Storage';
  constructor(public payload: any) {}
}

export class DialerLogin {
  static readonly type = '[Dialer] Login';
  constructor(public campaign: DialerCampaign) {}
}

export class DialerReLogin {
  static readonly type = '[Dialer] Re Login';
}

export class DialerLoginFailure {
  static readonly type = '[Dialer] Login Failure';
  constructor(public error: any) {}
}

export class DialerLogout {
  static readonly type = '[Dialer] Logout';
  constructor(public shouldClosePanel: boolean = false) {}
}

export class DialerLogoutSuccess {
  static readonly type = '[Dialer] Logout Success';
  constructor(public shouldClosePanel: boolean) {}
}

export class DialerLogoutFailure {
  static readonly type = '[Dialer] Logout Failure';
  constructor(public error: any) {}
}

export class DialerPause {
  static readonly type = '[Dialer] Pause';
  constructor(public data: Object) {}
}

export class DialerUnPause {
  static readonly type = '[Dialer] Un Pause';
  constructor(public data: Object) {}
}

export class DialerHangUp {
  static readonly type = '[Dialer] Hang Up';
}

export class DialerQuickHangUp {
  static readonly type = '[Dialer] Quick Hang Up';
}

export class DialerSetStatus {
  static readonly type = '[Dialer] Set Status';
  constructor(public type: string, public data: any) {}
}

export class DialerShowDispoModal {
  static readonly type = '[Dialer] Show Dispo Modal';
}
export class DialerSetShowDispoModal {
  static readonly type = '[Dialer] Set Show Dispo Modal';
}

export class DialerDial {
  static readonly type = '[Dialer] Dial';
  constructor(public data: { phoneNumber: string, leadId?: number, callbackId?: number }) {}
}

export class DialerTransfer {
  static readonly type = '[Dialer] Transfer';
  constructor(public data: { phoneNumber: string, leadId?: number, callbackId?: number }) {}
}

export class DialerHold {
  static readonly type = '[Dialer] Hold';
}

export class DialerDisconnected {
  static readonly type = '[Dialer] Disconnected';
}

export class DialerLeadDisconnected {
  static readonly type = '[Dialer] Lead Disconnected';
  constructor(public data: any) {}
}

export class SetLead {
  static readonly type = '[Dialer] Set Lead';
  constructor(public lead: Lead) {}
}

export class UpdateLead {
  static readonly type = '[Dialer] Update Lead';
  constructor(public lead: Lead) {}
}

export class CreateIframe {
  static readonly type = '[Dialer] Create Vici Iframe';
  constructor(public loginData: { extension: number, agent: string, campaign: number }) {}
}

export class DestroyIframe {
  static readonly type = '[Dialer] Destroy Vici Iframe';
}
