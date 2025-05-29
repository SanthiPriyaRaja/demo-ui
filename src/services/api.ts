import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getCurrentTenant, getTenantApiUrl, getTenantApiId } from '../utils/tenant';

// Registration interface
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

class ApiService {
  private axiosInstance: AxiosInstance;
  private currentTenant: string;
  private authToken: string | null = null;
  private tenantId: string | null = null;

  constructor() {
    this.currentTenant = getCurrentTenant();
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:3000', // Use your backend URL directly
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': 'technxt'
      },
    });

    this.setupInterceptors();
  }

  // Set authentication data (token and tenant ID)
  public setAuthData(token: string, tenantId: string) {
    this.authToken = token;
    this.tenantId = tenantId;
    console.log('API Service - Auth data set:', { token: token.substring(0, 20) + '...', tenantId });
  }

  // Clear authentication data
  public clearAuthData() {
    this.authToken = null;
    this.tenantId = null;
    console.log('API Service - Auth data cleared');
  }

  // Get current auth data
  public getAuthData() {
    return {
      token: this.authToken,
      tenantId: this.tenantId
    };
  }

  private setupInterceptors() {
    // Request interceptor to add auth token and tenant info
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add bearer token if available
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        } else {
          // Fallback to localStorage if not set in service
          const token = localStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        
        // Add tenant header
        if (this.tenantId) {
          config.headers['X-Tenant-ID'] = this.tenantId;
        } else {
          const storedTenantId = localStorage.getItem('tenantId');
          if (storedTenantId) {
            config.headers['X-Tenant-ID'] = storedTenantId;
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - clear auth and redirect to login
          this.clearAuthData();
          localStorage.removeItem('authToken');
          localStorage.removeItem('tenantId');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Update tenant and reconfigure base URL
  public updateTenant(tenant: string) {
    this.currentTenant = tenant;
    // Update the tenant header for future requests
  }

  // Temporarily set tenant for a single request
  public async registerWithTenant(data: RegisterData, tenant: string): Promise<RegisterResponse> {
    const backendTenantId = getTenantApiId(tenant);
    
    // Debug logging
    console.log(`Registration API Request - Frontend Tenant: ${tenant}, Backend Tenant ID: ${backendTenantId}`);
    
    const response = await this.axiosInstance.post<RegisterResponse>('/auth/register', data, {
      headers: {
        'X-Tenant-ID': backendTenantId,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  // Login with explicit tenant selection
  public async loginWithTenant(email: string, password: string, tenant: string): Promise<any> {
    const backendTenantId = getTenantApiId(tenant);
    
    // Debug logging
    console.log(`Login API Request - Frontend Tenant: ${tenant}, Backend Tenant ID: ${backendTenantId}`);
    
    const response = await this.axiosInstance.post('/auth/login', { email, password }, {
      headers: {
        'X-Tenant-ID': backendTenantId,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  // Authentication methods
  public async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await this.axiosInstance.post<RegisterResponse>('/auth/register', data);
    return response.data;
  }

  public async login(email: string, password: string): Promise<any> {
    const response = await this.axiosInstance.post('/auth/login', { email, password });
    return response.data;
  }

  // Generic API methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;