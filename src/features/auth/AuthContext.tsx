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
    tenant: 'tenant1', // Maps to 'technxt'
  },
  {
    id: '2',
    email: 'user@iorta.com',
    password: 'password',
    firstName: 'User',
    lastName: 'Iorta',
    tenant: 'tenant2', // Maps to 'iorta'
  },
  {
    id: '3',
    email: 'demo@demo.com',
    password: 'password',
    firstName: 'Demo',
    lastName: 'User',
    tenant: 'demo',
  },
  {
    id: '4',
    email: 'sai@gmail.com',
    password: '12345',
    firstName: 'Sai',
    lastName: 'Kumar',
    tenant: 'tenant1', // Maps to 'technxt'
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
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedTenantId && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
        setTenantId(savedTenantId);
        
        // Update API service with stored values
        apiService.setAuthData(savedToken, savedTenantId);
      } catch (err) {
        // Invalid saved user data, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('tenantId');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, tenant?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try real API first
      try {
        let response;
        
        if (tenant) {
          // Use tenant-specific login
          response = await apiService.loginWithTenant(email, password, tenant);
        } else {
          // Use default login with current tenant from URL
          const currentTenant = getCurrentTenant();
          response = await apiService.loginWithTenant(email, password, currentTenant);
        }
        
        // Handle API response - check for both 'token' and 'access_token'
        const authToken = response.access_token || response.token;
        
        if (authToken && response.user) {
          // IMPORTANT: Use tenant information from API response if available
          // This allows different users to belong to different tenants
          let userTenant: string;
          let userTenantId: string;
          
          if (response.user.tenant || response.tenant) {
            // If API returns tenant info, use that
            const apiTenant = response.user.tenant || response.tenant;
            userTenant = apiTenant;
            userTenantId = getTenantApiId(apiTenant);
          } else {
            // Fallback to URL-based tenant if API doesn't return tenant info
            const currentTenant = tenant || getCurrentTenant();
            userTenant = currentTenant;
            userTenantId = getTenantApiId(currentTenant);
          }
          
          const apiUser: User = {
            id: response.user.id || response.user._id || '1',
            email: response.user.email,
            name: response.user.firstName && response.user.lastName 
              ? `${response.user.firstName} ${response.user.lastName}` 
              : response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            tenant: userTenant,
            tenantId: userTenantId,
          };
          
          // Save to localStorage
          localStorage.setItem('authToken', authToken);
          localStorage.setItem('tenantId', userTenantId);
          localStorage.setItem('user', JSON.stringify(apiUser));
          
          // Update state
          setUser(apiUser);
          setToken(authToken);
          setTenantId(userTenantId);
          
          // Update API service with auth data
          apiService.setAuthData(authToken, userTenantId);
          
          console.log('Login successful - Stored data:');
          console.log('Token:', authToken);
          console.log('User Tenant:', userTenant);
          console.log('User Tenant ID:', userTenantId);
          console.log('User:', apiUser);
          console.log('Full API Response:', response);
          
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
          const userTenant = mockUser.tenant;
          const userTenantId = getTenantApiId(userTenant);
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          const authenticatedUser: User = {
            id: mockUser.id,
            email: mockUser.email,
            name: `${mockUser.firstName} ${mockUser.lastName}`,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            tenant: userTenant,
            tenantId: userTenantId,
          };
          
          // Save to localStorage
          localStorage.setItem('authToken', mockToken);
          localStorage.setItem('tenantId', userTenantId);
          localStorage.setItem('user', JSON.stringify(authenticatedUser));
          
          // Update state
          setUser(authenticatedUser);
          setToken(mockToken);
          setTenantId(userTenantId);
          
          // Update API service with auth data
          apiService.setAuthData(mockToken, userTenantId);
          
          console.log('Mock login successful - Stored data:');
          console.log('Token:', mockToken);
          console.log('User Tenant:', userTenant);
          console.log('User Tenant ID:', userTenantId);
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
    localStorage.removeItem('user');
    
    // Clear state
    setUser(null);
    setToken(null);
    setTenantId(null);
    setError(null);
    
    // Clear API service auth data
    apiService.clearAuthData();
    
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