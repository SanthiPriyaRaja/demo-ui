import { useAuth } from '../features/auth/AuthContext';
import { apiService } from '../services/api';

export const useAuthData = () => {
  const { token, tenantId, user, isAuthenticated } = useAuth();

  // Get auth data from API service (fallback)
  const apiAuthData = apiService.getAuthData();

  // Get auth data from localStorage (fallback)
  const getStoredAuthData = () => {
    return {
      token: localStorage.getItem('authToken'),
      tenantId: localStorage.getItem('tenantId'),
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
    };
  };

  // Get the most reliable auth data
  const getAuthData = () => {
    const storedData = getStoredAuthData();
    
    return {
      token: token || apiAuthData.token || storedData.token,
      tenantId: tenantId || apiAuthData.tenantId || storedData.tenantId,
      user: user || storedData.user,
      isAuthenticated
    };
  };

  // Check if user has valid authentication
  const hasValidAuth = () => {
    const authData = getAuthData();
    return !!(authData.token && authData.tenantId && authData.user);
  };

  // Get headers for API requests
  const getApiHeaders = () => {
    const authData = getAuthData();
    return {
      'Authorization': authData.token ? `Bearer ${authData.token}` : undefined,
      'x-tenant-id': authData.tenantId || undefined,
      'Content-Type': 'application/json'
    };
  };

  return {
    ...getAuthData(),
    hasValidAuth,
    getApiHeaders,
    getStoredAuthData
  };
}; 