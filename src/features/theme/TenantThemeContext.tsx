import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTenantColors } from '../../utils/colors';
import type { TenantColors } from '../../utils/colors';
import { useTenant } from '../tenant/TenantContext';

interface TenantThemeContextType {
    colors: TenantColors;
}

const TenantThemeContext = createContext<TenantThemeContextType | undefined>(undefined);

export const useTenantTheme = () => {
    const context = useContext(TenantThemeContext);
    if (!context) {
        throw new Error('useTenantTheme must be used within a TenantThemeProvider');
    }
    return context;
};

export const TenantThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentTenant } = useTenant();
    const [colors, setColors] = useState<TenantColors>(() => {
        return getTenantColors(currentTenant || 'tenant1');
    });

    useEffect(() => {
        setColors(getTenantColors(currentTenant || 'tenant1'));
    }, [currentTenant]);

    return (
        <TenantThemeContext.Provider value={{ colors }}>
            {children}
        </TenantThemeContext.Provider>
    );
}; 