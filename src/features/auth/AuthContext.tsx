import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentTenant, getTenantApiId } from '../../utils/tenant';
import { apiService } from '../../services/api';

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  tenant: string;
  tenantId: string; // Backend tenant ID
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  tenantId: string | null;
  login: (email: string, password: string, tenant?: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Mock user database for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'admin@technxt.com',
    password: 'password',
    firstName: 'Admin',
    lastName: 'TechNXT',
  },
  {
    id: '2',
    email: 'user@iorta.com',
    password: 'password',
    firstName: 'User',
    lastName: 'Iorta',
  },
  {
    id: '3',
    email: 'demo@demo.com',
    password: 'password',
    firstName: 'Demo',
    lastName: 'User',
  },
  {
    id: '4',
    email: 'sai@gmail.com',
    password: '12345',
    firstName: 'Sai',
    lastName: 'Kumar',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in on app start
    const savedToken = localStorage.getItem('authToken');
    const savedTenantId = localStorage.getItem('tenantId');
    const savedSelectedTenant = localStorage.getItem('selectedTenant');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedTenantId && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
        setTenantId(savedTenantId);
        
        // Update API service with stored values
        apiService.setAuthData(savedToken, savedTenantId);
        
        // If we have a saved selected tenant, update the URL to match
        if (savedSelectedTenant && savedSelectedTenant !== getCurrentTenant()) {
          const url = new URL(window.location.href);
          url.searchParams.set('tenant', savedSelectedTenant);
          window.history.replaceState({}, '', url.toString());
        }
        
        console.log('Restored auth data from localStorage:');
        console.log('Token:', savedToken);
        console.log('Selected Tenant:', savedSelectedTenant);
        console.log('Tenant ID:', savedTenantId);
        console.log('User:', parsedUser);
      } catch (err) {
        // Invalid saved user data, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('tenantId');
        localStorage.removeItem('selectedTenant');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, tenant?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Ensure we have a tenant - use the provided tenant or get from URL
      const selectedTenant = tenant || getCurrentTenant();
      const selectedTenantId = getTenantApiId(selectedTenant);
      
      // Try real API first
      try {
        const response = await apiService.loginWithTenant(email, password, selectedTenant);
        
        // Handle API response - check for both 'token' and 'access_token'
        const authToken = response.access_token || response.token;
        
        if (authToken && response.user) {
          // Use the selected tenant from login form, not from API response
          // This ensures the user's choice is respected
          const apiUser: User = {
            id: response.user.id || response.user._id || '1',
            email: response.user.email,
            name: response.user.firstName && response.user.lastName 
              ? `${response.user.firstName} ${response.user.lastName}` 
              : response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            tenant: selectedTenant,
            tenantId: selectedTenantId,
          };
          
          // Save to localStorage
          localStorage.setItem('authToken', authToken);
          localStorage.setItem('tenantId', selectedTenantId);
          localStorage.setItem('selectedTenant', selectedTenant);
          localStorage.setItem('user', JSON.stringify(apiUser));
          
          // Update state
          setUser(apiUser);
          setToken(authToken);
          setTenantId(selectedTenantId);
          
          // Update API service with auth data
          apiService.setAuthData(authToken, selectedTenantId);
          
          console.log('Login successful - Stored data:');
          console.log('Token:', authToken);
          console.log('Selected Tenant:', selectedTenant);
          console.log('Tenant ID:', selectedTenantId);
          console.log('User:', apiUser);
          
          return;
        } else {
          throw new Error('Invalid response: missing token or user data');
        }
      } catch (apiError: any) {
        console.log('API login failed, trying fallback:', apiError.message);
        
        // If API fails, fall back to mock authentication for demo purposes
        const mockUser = mockUsers.find(user => 
          user.email === email && user.password === password
        );
        
        if (mockUser) {
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          const authenticatedUser: User = {
            id: mockUser.id,
            email: mockUser.email,
            name: `${mockUser.firstName} ${mockUser.lastName}`,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            tenant: selectedTenant,
            tenantId: selectedTenantId,
          };
          
          // Save to localStorage
          localStorage.setItem('authToken', mockToken);
          localStorage.setItem('tenantId', selectedTenantId);
          localStorage.setItem('selectedTenant', selectedTenant);
          localStorage.setItem('user', JSON.stringify(authenticatedUser));
          
          // Update state
          setUser(authenticatedUser);
          setToken(mockToken);
          setTenantId(selectedTenantId);
          
          // Update API service with auth data
          apiService.setAuthData(mockToken, selectedTenantId);
          
          console.log('Mock login successful - Stored data:');
          console.log('Token:', mockToken);
          console.log('Selected Tenant:', selectedTenant);
          console.log('Tenant ID:', selectedTenantId);
          console.log('User:', authenticatedUser);
          
          return;
        }
        
        // If both API and fallback fail, throw the API error
        throw apiError;
      }
      
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 404) {
        setError('User not found');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('selectedTenant');
    localStorage.removeItem('user');
    
    // Clear state
    setUser(null);
    setToken(null);
    setTenantId(null);
    setError(null);
    
    // Clear API service auth data
    apiService.clearAuthData();
    
    // Clear tenant URL parameter
    const url = new URL(window.location.href);
    url.searchParams.delete('tenant');
    window.history.replaceState({}, '', url.toString());
    
    // Dispatch custom event to notify TenantContext
    window.dispatchEvent(new CustomEvent('logout'));
    
    console.log('Logout successful - Cleared all stored data');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    token,
    tenantId,
    login,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 