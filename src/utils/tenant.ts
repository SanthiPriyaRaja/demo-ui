import axios from 'axios';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
}

// Mapping from frontend tenant names to backend tenant IDs
export const getTenantApiId = (frontendTenant: string): string => {
  const tenantMapping: Record<string, string> = {
    'tenant1': 'technxt',
    'tenant2': 'iorta',
    
  };
  
  return tenantMapping[frontendTenant] || frontendTenant;
};

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
  // First try to get tenant from localStorage (stored during login)
  const storedTenant = localStorage.getItem('selectedTenant');
  if (storedTenant) {
    return storedTenant;
  }
  
  // Then try to get tenant from subdomain
  const subdomainTenant = getTenantFromSubdomain();
  if (subdomainTenant) {
    return subdomainTenant;
  }
  
  // Then try query parameter
  const queryTenant = getTenantFromQuery();
  if (queryTenant) {
    return queryTenant;
  }
  
  // Default to tenant1 (which maps to technxt)
  return 'tenant1';
};

export const getTenantApiUrl = (tenant: string): string => {
  const baseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:3000';
  return baseUrl;
};

export const setTenantInUrl = (tenant: string): void => {
  const url = new URL(window.location.href);
  url.searchParams.set('tenant', tenant);
  window.history.replaceState({}, '', url.toString());
};