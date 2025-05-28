export type LeadProgress =
  | 'New Lead Entry'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost';

export interface Lead {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
    landlineNo: string;
    province: string;
    city: string;
    leadType: string;
    leadStatus: 'Open' | 'Converted' | 'Rejected' | 'Discarded';
    leadProgress: LeadProgress;
    allocatorRemarks: string;
    userRemarks: string;
    appointmentDate: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export type LeadTab = 'All' | 'Open' | 'Converted' | 'Rejected' | 'Discarded';