import axios, { type InternalAxiosRequestConfig, AxiosHeaders, AxiosError } from 'axios';
import type { Lead } from '../types/Lead';

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

// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// Add request interceptor to dynamically set headers
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    const tenantId = localStorage.getItem('tenantId');
    
    if (!config.headers) {
        config.headers = new AxiosHeaders();
    }
    
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }
    if (tenantId) {
        config.headers.set('x-tenant-id', tenantId);
    }
    config.headers.set('Content-Type', 'application/json');
    
    return config;
});

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

            const response = await axiosInstance.get<Lead[]>(url);
            return response.data;
        } catch (error) {
            const apiError: LeadServiceError = {
                message: 'Failed to fetch leads'
            };

            if (error instanceof AxiosError) {
                apiError.status = error.response?.status;
                apiError.data = error.response?.data;
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
     * @throws {AxiosError} When the API request fails
     */
    createLead: async (tenantId: string, leadData: Partial<Lead>): Promise<Lead> => {
        try {
            const response = await axiosInstance.post<Lead>('/lead', leadData);
            return response.data;
        } catch (error) {
            const apiError: LeadServiceError = {
                message: 'Failed to create lead'
            };

            if (error instanceof AxiosError) {
                apiError.status = error.response?.status;
                apiError.data = error.response?.data;
                console.error('API Error:', apiError);
            } else {
                console.error('Error creating lead:', error);
            }
            
            // Rethrow error for create operations
            throw error;
        }
    }
};