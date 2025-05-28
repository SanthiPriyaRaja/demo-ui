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
          // Use default login
          response = await apiService.login(email, password);
        }
        
        // Handle API response - check for both 'token' and 'access_token'
        const authToken = response.access_token || response.token;
        
        if (authToken && response.user) {
          const currentTenant = tenant || getCurrentTenant();
          const backendTenantId = getTenantApiId(currentTenant);
          
          const apiUser: User = {
            id: response.user.id || response.user._id || '1',
            email: response.user.email,
            name: response.user.firstName && response.user.lastName 
              ? `${response.user.firstName} ${response.user.lastName}` 
              : response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            tenant: currentTenant,
            tenantId: backendTenantId,
          };
          
          // Save to localStorage
          localStorage.setItem('authToken', authToken);
          localStorage.setItem('tenantId', backendTenantId);
          localStorage.setItem('user', JSON.stringify(apiUser));
          
          // Update state
          setUser(apiUser);
          setToken(authToken);
          setTenantId(backendTenantId);
          
          // Update API service with auth data
          apiService.setAuthData(authToken, backendTenantId);
          
          console.log('Login successful - Stored data:');
          console.log('Token:', authToken);
          console.log('Tenant ID:', backendTenantId);
          console.log('User:', apiUser);
          console.log('Full API Response:', response);
          
          return;
        } else {
          throw new Error('Invalid response: missing token or user data');
        }
      } catch (apiError: any) {
        console.log('API login failed, trying fallback:', apiError.message);
        
        // If API fails, fall back to mock authentication for demo purposes
        if (email === 'admin@example.com' && password === 'password') {
          const currentTenant = tenant || getCurrentTenant();
          const backendTenantId = getTenantApiId(currentTenant);
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          const mockUser: User = {
            id: '1',
            email,
            name: 'Admin User',
            tenant: currentTenant,
            tenantId: backendTenantId,
          };
          
          // Save to localStorage
          localStorage.setItem('authToken', mockToken);
          localStorage.setItem('tenantId', backendTenantId);
          localStorage.setItem('user', JSON.stringify(mockUser));
          
          // Update state
          setUser(mockUser);
          setToken(mockToken);
          setTenantId(backendTenantId);
          
          // Update API service with auth data
          apiService.setAuthData(mockToken, backendTenantId);
          
          console.log('Mock login successful - Stored data:');
          console.log('Token:', mockToken);
          console.log('Tenant ID:', backendTenantId);
          console.log('User:', mockUser);
          
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