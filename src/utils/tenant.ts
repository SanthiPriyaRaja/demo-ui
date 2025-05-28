import axios from 'axios';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
}

export const getTenantFromSubdomain = (): string | null => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // If we have more than 2 parts (e.g., tenant.example.com), the first part is the tenant
  if (parts.length > 2) {
    return parts[0];
  }
  
  return null;
};

export const getTenantFromQuery = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('tenant');
};

export const getCurrentTenant = (): string => {
  // Always return the default tenant 'technxt'
  return 'technxt';
};

export const getTenantApiUrl = (tenant: string): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  return baseUrl;
};

export const setTenantInUrl = (tenant: string): void => {
  const url = new URL(window.location.href);
  url.searchParams.set('tenant', tenant);
  window.history.replaceState({}, '', url.toString());
};