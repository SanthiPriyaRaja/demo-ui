import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentTenant, setTenantInUrl } from '../../utils/tenant';
import type { Tenant } from '../../utils/tenant';
import { apiService } from '../../services/api';

interface TenantContextType {
  currentTenant: string;
  switchTenant: (tenant: string) => void;
  availableTenants: Tenant[];
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<string>(getCurrentTenant());
  
  // Mock available tenants - in a real app, this would come from an API
  const [availableTenants] = useState<Tenant[]>([
    { id: 'default', name: 'Default Tenant', subdomain: 'default' },
    { id: 'tenant1', name: 'Tenant 1 (TechNXT)', subdomain: 'tenant1' },
    { id: 'tenant2', name: 'Tenant 2 (Iorta)', subdomain: 'tenant2' },
    { id: 'demo', name: 'Demo Tenant', subdomain: 'demo' },
    { id: 'test', name: 'Test Tenant', subdomain: 'test' },
    { id: 'technxt', name: 'TechNXT', subdomain: 'technxt' },
    { id: 'iorta', name: 'Iorta', subdomain: 'iorta' },
  ]);

  useEffect(() => {
    // Update API service when tenant changes
    apiService.updateTenant(currentTenant);
  }, [currentTenant]);

  const switchTenant = (tenant: string) => {
    setTenantInUrl(tenant);
    setCurrentTenant(tenant);
    apiService.updateTenant(tenant);
    
    // Clear auth state when switching tenants for security
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Reload to ensure clean state
    window.location.reload();
  };

  const value: TenantContextType = {
    currentTenant,
    switchTenant,
    availableTenants,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};