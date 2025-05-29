import type { Lead } from '../types/Lead';
import { apiService } from './api';

// Types for request/response
interface LeadFilters {
    search?: string;
    leadStatus?: string;
    leadType?: string;
    leadProgress?: string;
    province?: string;
    city?: string;
}

interface LeadServiceError {
    message: string;
    status?: number;
    data?: unknown;
}

export class LeadError extends Error {
    constructor(
        message: string,
        public status?: number,
        public data?: unknown
    ) {
        super(message);
        this.name = 'LeadError';
    }
}

export const leadService = {
    /**
     * Get leads with optional filters
     * @param tenantId - The tenant identifier
     * @param filters - Optional filters for the leads query
     * @returns Promise<Lead[]> - Array of leads
     */
    getLeads: async (tenantId: string, filters?: LeadFilters): Promise<Lead[]> => {
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

            return await apiService.get<Lead[]>(url);
        } catch (error) {
            const apiError: LeadServiceError = {
                message: 'Failed to fetch leads'
            };

            if (error && typeof error === 'object' && 'response' in error) {
                apiError.status = (error as any).response?.status;
                apiError.data = (error as any).response?.data;
                console.error('API Error:', apiError);
            } else {
                console.error('Error fetching leads:', error);
            }
            
            // Return empty array for GET requests to prevent UI crashes
            return [];
        }
    },

    /**
     * Create a new lead
     * @param tenantId - The tenant identifier
     * @param leadData - The lead data to create
     * @returns Promise<Lead> - The created lead
     * @throws {LeadError} When the API request fails with specific error details
     */
    createLead: async (tenantId: string, leadData: Partial<Lead>): Promise<Lead> => {
        try {
            return await apiService.post<Lead>('/lead', leadData);
        } catch (error) {
            // Extract error details
            let errorMessage = 'Failed to create lead';
            let statusCode: number | undefined;
            let errorData: unknown;

            if (error && typeof error === 'object' && 'response' in error) {
                const response = (error as any).response;
                statusCode = response?.status;
                errorData = response?.data;
                
                // Use the specific error message from the API if available
                if (response?.data?.message) {
                    errorMessage = response.data.message;
                }
            }

            console.error('Lead Creation Error:', {
                message: errorMessage,
                status: statusCode,
                data: errorData
            });

            // Throw a custom error with all the details
            throw new LeadError(errorMessage, statusCode, errorData);
        }
    }
};