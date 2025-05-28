import axios, { type InternalAxiosRequestConfig, AxiosHeaders, AxiosError } from 'axios';
import type { Lead } from '../types/Lead';
import { getApiUrl } from '../config';

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

// Create axios instance with default config
const createAxiosInstance = () => {
    const instance = axios.create({
        baseURL: getApiUrl(),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Add request interceptor to set auth and tenant headers
    instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken');
        const tenantId = localStorage.getItem('tenantId');
        
        if (token) {
            (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
        }
        if (tenantId) {
            (config.headers as AxiosHeaders).set('X-Tenant-ID', tenantId);
        }
        return config;
    });

    return instance;
};

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

            const axiosInstance = createAxiosInstance();
            const response = await axiosInstance.get<Lead[]>(url);
            return response.data;
        } catch (error) {
            const apiError: LeadServiceError = {
                message: 'Failed to fetch leads'
            };

            if (error && typeof error === 'object' && 'response' in error) {
                apiError.status = (error as AxiosError).response?.status;
                apiError.data = (error as AxiosError).response?.data;
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
            const axiosInstance = createAxiosInstance();
            const response = await axiosInstance.post<Lead>('/lead', leadData);
            return response.data;
        } catch (error) {
            const apiError: LeadServiceError = {
                message: 'Failed to create lead'
            };

            if (error && typeof error === 'object' && 'response' in error) {
                apiError.status = (error as AxiosError).response?.status;
                apiError.data = (error as AxiosError).response?.data;
                console.error('API Error:', apiError);
            } else {
                console.error('Error creating lead:', error);
            }
            
            // Rethrow error for create operations
            throw error;
        }
    }
};