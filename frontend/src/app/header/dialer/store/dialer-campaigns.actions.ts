import { DialerCampaign, UserGroup } from '@dialer/models/campaign.model';

export class DialerGetCampaigns {
  static readonly type = '[Dialer] Get Campaigns';
}

export class DialerGetCampaignsSuccess {
  static readonly type = '[Dialer] Get Campaigns Success';
  constructor(public userGroup: UserGroup) {}
}

export class DialerGetCampaignsFailure {
  static readonly type = '[Dialer] Get Campaigns Failure';
  constructor(public error: any) {}
}

export class SetActiveCampaign {
  static readonly type = '[Dialer] Set Active Campaign';
  constructor(public campaign: DialerCampaign) {}
}

export class DetectedActiveCampaignChanged {
  static readonly type = '[Dialer] Detected Active Campaign Changed';
  constructor(public payload: any) {}
}
