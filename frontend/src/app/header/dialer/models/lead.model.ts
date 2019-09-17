export interface Lead {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address1: string;
  address2: string;
  city: string;
  comments: string;
}

export class LeadDispoInfo {
  fullName: string;
  email: string
  phoneNumber: string;
  address: string;

  constructor(lead: Lead) {
    this.fullName = (lead.first_name
      ? `${lead.first_name} ` : '')
      +
      (lead.last_name
        ? lead.last_name : '');
    this.address = (lead.address1 ? lead.address1 : lead.address2);
    this.phoneNumber = lead.phone_number;
    this.email = lead.email;
  }
}
