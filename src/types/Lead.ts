export interface Lead {
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
    landlineNo: string;
    province: string;
    city: string;
    leadType: string;
    leadStatus: 'In Progress' | 'Rejected' | 'Archived';
    leadProgress: string;
    allocatorRemarks: string;
    userRemarks: string;
    appointmentDate: string;
}

export type LeadTab = 'All' | 'In Progress' | 'Rejected' | 'Archived'; 