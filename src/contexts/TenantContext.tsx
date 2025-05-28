import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant } from '../types/tenant';
import { tenants } from '../config/tenants';

interface TenantContextType {
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    // Get tenant configuration based on hostname
    const tenant = tenants[hostname] || tenants['localhost'];
    setCurrentTenant(tenant);
  }, []);

  return (
    <TenantContext.Provider value={{ currentTenant, setCurrentTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}; 