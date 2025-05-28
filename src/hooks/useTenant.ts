import { useState, useEffect } from 'react';
import { getCurrentTenant, setTenantInUrl } from '../utils/tenant';
import { apiService } from '../services/api';

export const useTenant = () => {
  const [currentTenant, setCurrentTenant] = useState<string>(getCurrentTenant());

  useEffect(() => {
    // Listen for URL changes to update tenant
    const handleLocationChange = () => {
      const newTenant = getCurrentTenant();
      if (newTenant !== currentTenant) {
        setCurrentTenant(newTenant);
        // Update API service with new tenant
        apiService.updateTenant(newTenant);
      }
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [currentTenant]);

  const switchTenant = (tenant: string) => {
    setTenantInUrl(tenant);
    setCurrentTenant(tenant);
    apiService.updateTenant(tenant);
    // Optionally reload the page to ensure clean state
    window.location.reload();
  };

  return {
    currentTenant,
    switchTenant,
  };
}; 