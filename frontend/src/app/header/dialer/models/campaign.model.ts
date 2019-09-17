export interface UserGroup {
  userGroup: string;
  campaigns?: DialerCampaign[];
}

export interface DialerCampaign {
  id: number;
  name: string;
  empty: boolean;
  noLeadsLoginAllowed: boolean;
  percentage?: string;
}
