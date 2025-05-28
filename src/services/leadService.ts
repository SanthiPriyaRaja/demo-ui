import axios from 'axios';
import type { Lead } from '../types/Lead';

const API_URL = 'http://localhost:3000';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'x-tenant-id': 'technxt',
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

export const leadService = {
    getLeads: async (tenantId: string, filters?: {
        search?: string;
        leadStatus?: string;
        leadType?: string;
        leadProgress?: string;
        province?: string;
        city?: string;
    }) => {
        try {
            let url = '/lead';
            
            // Build query string
            if (filters) {
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value) params.append(key, value);
                });
                if (params.toString()) {
                    url += `?${params.toString()}`;
                }
            }

            const response = await axiosInstance.get<Lead[]>(url);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('API Error:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data
                });
            } else {
                console.error('Error fetching leads:', error);
            }
            return []; // Return empty array instead of throwing to prevent UI crashes
        }
    },

    createLead: async (tenantId: string, leadData: Partial<Lead>) => {
        try {
            const response = await axiosInstance.post<Lead>('/lead', leadData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('API Error:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data
                });
            } else {
                console.error('Error creating lead:', error);
            }
            throw error;
        }
    }
};