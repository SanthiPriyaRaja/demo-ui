import axios from 'axios';
import type { Lead } from '../types/Lead';

const API_URL = 'http://localhost:3000';

const SAMPLE_LEADS: Lead[] = [
    {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        mobileNo: "9123456789",
        landlineNo: "1234567890",
        province: "British Columbia",
        city: "Vancouver",
        leadType: "Support",
        leadStatus: "In Progress",
        leadProgress: "New Lead Entry",
        allocatorRemarks: "High priority customer",
        userRemarks: "Interested in premium support package. Need to follow up on technical requirements.",
        appointmentDate: "2024-05-30T10:00:00Z"
    },
    {
        firstName: "Sarah",
        lastName: "Smith",
        email: "sarah.smith@example.com",
        mobileNo: "9876543210",
        landlineNo: "0987654321",
        province: "Ontario",
        city: "Toronto",
        leadType: "Sales",
        leadStatus: "Rejected",
        leadProgress: "Initial Contact Made",
        allocatorRemarks: "Budget constraints",
        userRemarks: "Customer looking for lower price point. Current offerings not within budget range.",
        appointmentDate: "2024-05-25T14:30:00Z"
    },
    {
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael.j@example.com",
        mobileNo: "8765432109",
        landlineNo: "7654321098",
        province: "Alberta",
        city: "Calgary",
        leadType: "Consultation",
        leadStatus: "Archived",
        leadProgress: "Completed",
        allocatorRemarks: "Regular client",
        userRemarks: "Successfully completed initial consultation. Client may return for additional services.",
        appointmentDate: "2024-05-20T09:15:00Z"
    }
];

export const leadService = {
    getLeads: async (tenantId: string) => {
        try {
            // For demonstration, return sample data instead of making API call
            return Promise.resolve(SAMPLE_LEADS);
            
            // Actual API call code (commented out for now)
            /*const response = await axios.get<Lead[]>(`${API_URL}/lead`, {
                headers: {
                    'x-tenant-id': tenantId,
                    'Content-Type': 'application/json',
                }
            });
            return response.data;*/
        } catch (error) {
            console.error('Error fetching leads:', error);
            throw error;
        }
    }
}; 