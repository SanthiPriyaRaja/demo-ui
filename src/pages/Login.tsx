import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { getTenantApiId } from '../utils/tenant';
import { useTenant } from '../features/tenant/TenantContext';

interface FormData {
  email: string;
  password: string;
  selectedTenant: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  selectedTenant?: string;
}

export const Login: React.FC = () => {
  const { login, error: authError, isLoading: authLoading, isAuthenticated } = useAuth();
  const { currentTenant, availableTenants, switchTenant } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    selectedTenant: currentTenant,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  // Get registration success message from navigation state
  const registrationMessage = location.state?.message;
  
  // Clear registration message from state after displaying
  useEffect(() => {
    if (registrationMessage) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [registrationMessage, navigate, location.pathname]);
  
  // Update selected tenant when current tenant changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      selectedTenant: currentTenant,
    }));
  }, [currentTenant]);
  
  // Get backend tenant ID for display
  const backendTenantId = getTenantApiId(formData.selectedTenant);
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      // Add a small delay to show success message if it was just set
      const redirectDelay = loginSuccess ? 1500 : 0;
      setTimeout(() => {
        navigate('/dashboard');
      }, redirectDelay);
    }
  }, [isAuthenticated, authLoading, navigate, loginSuccess]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 5) {
      newErrors.password = 'Password must be at least 5 characters';
    }

    if (!formData.selectedTenant) {
      newErrors.selectedTenant = 'Please select a tenant';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // If tenant is changed, update the URL
    if (name === 'selectedTenant') {
      switchTenant(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setLoginSuccess(false);
    
    try {
      // Debug logging
      console.log('Login attempt with:');
      console.log('- Frontend Tenant:', formData.selectedTenant);
      console.log('- Backend Tenant ID:', backendTenantId);
      console.log('- Email:', formData.email);
      
      // Use the selected tenant for login
      await login(formData.email, formData.password, formData.selectedTenant);
      
      // Set success state
      setLoginSuccess(true);
      
      // Navigation will happen automatically via useEffect when isAuthenticated changes
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Login error:', err);
      setLoginSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-blue-100 text-sm">
              Sign in to your account
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 py-8">
            {/* Tenant Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Select Tenant
                </label>
              </div>
              <select
                name="selectedTenant"
                value={formData.selectedTenant}
                onChange={handleInputChange}
                className={`block w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-0 focus:border-blue-500 sm:text-sm transition-all duration-200 ease-in-out ${
                  errors.selectedTenant 
                    ? 'border-red-300 text-red-900 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300'
                }`}
              >
                <option value="">Choose your tenant...</option>
                {availableTenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
              {errors.selectedTenant && (
                <p className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                  <svg className="w-4 h-4 mr-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.selectedTenant}
                </p>
              )}
            </div>

            {/* Registration Success Message */}
            {registrationMessage && (
              <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Registration Successful!
                    </h3>
                    <div className="mt-1 text-sm text-green-700">
                      {registrationMessage}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Login Success Message */}
            {loginSuccess && (
              <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Login Successful!
                    </h3>
                    <div className="mt-1 text-sm text-green-700">
                      Welcome back! Redirecting to dashboard...
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  placeholder="Enter your email"
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
                
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  placeholder="Enter your password"
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>

              {authError && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 00-1.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Authentication Error
                      </h3>
                      <div className="mt-1 text-sm text-red-700">
                        {authError}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 space-y-3">
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>

                <div className="text-center">
                  <span className="text-sm text-gray-500">or</span>
                </div>

                <Link to="/register">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full h-12 text-base font-semibold transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Create New Account
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Secure multi-tenant authentication
          </p>
        </div>
      </div>
    </div>
  );
}; 