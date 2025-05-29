import React, { createContext, useContext, useEffect, useState } from 'react';
import { setTenantInUrl } from '../../utils/tenant';
import type { Tenant } from '../../utils/tenant';
import { apiService } from '../../services/api';

interface TenantContextType {
  currentTenant: string;
  switchTenant: (tenant: string, preserveAuth?: boolean) => void;
  availableTenants: Tenant[];
  resetTenant: () => void;
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
  // Get initial tenant from localStorage first, then URL, but don't default to a specific tenant
  const getInitialTenant = (): string => {
    const savedSelectedTenant = localStorage.getItem('selectedTenant');
    console.log('🔍 TenantContext - getInitialTenant:');
    console.log('  - savedSelectedTenant:', savedSelectedTenant);
    
    if (savedSelectedTenant) {
      console.log('  - Returning savedSelectedTenant:', savedSelectedTenant);
      return savedSelectedTenant;
    }
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const queryTenant = urlParams.get('tenant');
    console.log('  - queryTenant:', queryTenant);
    
    if (queryTenant) {
      console.log('  - Returning queryTenant:', queryTenant);
      return queryTenant;
    }
    
    // Check subdomain
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    console.log('  - hostname parts:', parts);
    
    if (parts.length > 2) {
      console.log('  - Returning subdomain tenant:', parts[0]);
      return parts[0];
    }
    
    // Default to tenant1 instead of empty string
    console.log('  - Returning default tenant: tenant1');
    return 'tenant1';
  };
  
  const [currentTenant, setCurrentTenant] = useState<string>(getInitialTenant());
  
  // Debug logging for currentTenant changes
  useEffect(() => {
    console.log('🏢 TenantContext - currentTenant changed to:', currentTenant);
  }, [currentTenant]);
  
  // Mock available tenants - in a real app, this would come from an API
  const [availableTenants] = useState<Tenant[]>([
    { id: 'tenant1', name: 'Tenant 1 (TechNXT)', subdomain: 'tenant1' },
    { id: 'tenant2', name: 'Tenant 2 (Iorta)', subdomain: 'tenant2' },
  ]);

  // Listen for logout events
  useEffect(() => {
    const handleLogout = () => {
      console.log('🚪 TenantContext - Logout event received, resetting tenant');
      setCurrentTenant('');
    };

    // Listen for custom logout event
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  useEffect(() => {
    // Only update API service when we have a valid tenant
    if (currentTenant) {
      apiService.updateTenant(currentTenant);
      
      // Update localStorage when tenant changes
      localStorage.setItem('selectedTenant', currentTenant);
      
      // Update URL to match current tenant
      const url = new URL(window.location.href);
      url.searchParams.set('tenant', currentTenant);
      window.history.replaceState({}, '', url.toString());
    } else {
      // Clear URL parameter when no tenant is selected
      const url = new URL(window.location.href);
      url.searchParams.delete('tenant');
      window.history.replaceState({}, '', url.toString());
    }
  }, [currentTenant]);

  const switchTenant = (tenant: string, preserveAuth = false) => {
    console.log('🔄 TenantContext - switchTenant:', { tenant, preserveAuth });
    
    // Check if we need to clear auth
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const shouldClearAuth = !preserveAuth && currentUser.tenant && currentUser.tenant !== tenant;
    
    console.log('TenantContext - switchTenant analysis:', {
      currentUser: currentUser.tenant,
      newTenant: tenant,
      shouldClearAuth
    });

    // Update tenant state
    setCurrentTenant(tenant);
    apiService.updateTenant(tenant);
    localStorage.setItem('selectedTenant', tenant);
    setTenantInUrl(tenant);

    if (shouldClearAuth) {
      console.log('TenantContext - Clearing auth during tenant switch');
      // Clear auth only if switching to a different tenant
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('tenantId');
      window.location.reload();
    } else {
      console.log('TenantContext - Preserving auth during tenant switch');
      // Just update the API service with current auth
      const savedToken = localStorage.getItem('authToken');
      const savedTenantId = localStorage.getItem('tenantId');
      if (savedToken && savedTenantId) {
        apiService.setAuthData(savedToken, savedTenantId);
      }
    }
  };

  const resetTenant = () => {
    setCurrentTenant('');
  };

  const value: TenantContextType = {
    currentTenant,
    switchTenant,
    availableTenants,
    resetTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};