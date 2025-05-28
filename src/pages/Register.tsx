import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { getCurrentTenant, getTenantApiId } from '../utils/tenant';
import { apiService } from '../services/api';
import type { RegisterData } from '../services/api';

interface FormData extends RegisterData {
  confirmPassword: string;
  selectedTenant: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  selectedTenant?: string;
}

// Available tenants for the dropdown
const AVAILABLE_TENANTS = [
  { id: 'tenant1', name: 'Tenant 1 (TechNXT)', backendId: 'technxt' },
  { id: 'tenant2', name: 'Tenant 2 (Iorta)', backendId: 'iorta' },  
];

export const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    selectedTenant: getCurrentTenant(), // Initialize with current tenant from URL
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [apiError, setApiError] = useState<string>('');
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentTenant = getCurrentTenant();
  const selectedTenantInfo = AVAILABLE_TENANTS.find(t => t.id === formData.selectedTenant);
  const backendTenantId = selectedTenantInfo ? selectedTenantInfo.backendId : getTenantApiId(formData.selectedTenant);
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 5) {
      newErrors.password = 'Password must be at least 5 characters';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Tenant validation
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

    // Clear API error when user makes changes
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');
    setSuccessMessage('');
    
    try {
      const registerData: RegisterData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      console.log('=== REGISTRATION ATTEMPT ===');
      console.log('Selected Tenant:', formData.selectedTenant);
      console.log('Backend Tenant ID:', backendTenantId);
      console.log('Registration Data:', registerData);
      console.log('============================');

      const response = await apiService.registerWithTenant(registerData, formData.selectedTenant);
      
      setSuccessMessage(response.message || 'Registration successful! You can now login.');
      
      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        selectedTenant: getCurrentTenant(),
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please login with your credentials.',
            email: registerData.email 
          } 
        });
      }, 2000);

    } catch (err: any) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response);
      
      if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setApiError('Invalid registration data. Please check your inputs.');
      } else if (err.response?.status === 409) {
        setApiError('An account with this email already exists.');
      } else {
        setApiError('Registration failed. Please try again later.');
      }
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-blue-100 text-sm">
              Join us today and get started
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 py-8">
            {/* Tenant Selection Info */}
            <div className="mb-6 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                </svg>
                Selected: {formData.selectedTenant} → API: {backendTenantId}
              </span>
            </div>

            {/* Debug Info (remove in production) */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg border text-xs">
              <div className="font-semibold text-gray-700 mb-2">Debug Info:</div>
              <div className="space-y-1 text-gray-600">
                <div>URL Tenant: {currentTenant}</div>
                <div>Selected Tenant: {formData.selectedTenant}</div>
                <div>Backend Tenant ID: {backendTenantId}</div>
                <div>API Header: x-tenant-id: {backendTenantId}</div>
              </div>
            </div>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Tenant Selection Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Select Tenant
                </label>
                <select
                  name="selectedTenant"
                  value={formData.selectedTenant}
                  onChange={handleInputChange}
                  className={`block w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-0 focus:border-blue-500 sm:text-sm transition-all duration-200 ease-in-out ${
                    errors.selectedTenant 
                      ? 'border-red-300 text-red-900 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300'
                  }`}
                  required
                >
                  <option value="">Choose your tenant...</option>
                  {AVAILABLE_TENANTS.map((tenant) => (
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

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  placeholder="Enter first name"
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
                
                <Input
                  label="Last Name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  placeholder="Enter last name"
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>

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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                placeholder="Create a password"
                className="transition-all duration-200 focus:scale-[1.02]"
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
                className="transition-all duration-200 focus:scale-[1.02]"
              />

              {/* Success Message */}
              {successMessage && (
                <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Success!
                      </h3>
                      <div className="mt-1 text-sm text-green-700">
                        {successMessage}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {apiError && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Registration Error
                      </h3>
                      <div className="mt-1 text-sm text-red-700">
                        {apiError}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  isLoading={isSubmitting}
                  disabled={isSubmitting || !!successMessage}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </div>

          {/* Footer Section */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Secure multi-tenant registration
          </p>
        </div>
      </div>
    </div>
  );
}; 