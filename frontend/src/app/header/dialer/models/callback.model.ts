export interface DialerCallback {
  datetime: string;
  leadId:  number;
  callbackId:  number;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  campaignName: string;
  active: boolean;
  comments: string;
}
