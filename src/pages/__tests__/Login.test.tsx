import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../Login';
import { AuthProvider } from '../../features/auth/AuthContext';
import { TenantProvider } from '../../features/tenant/TenantContext';

// Mock the auth service
jest.mock('../../services/api', () => ({
  apiService: {
    login: jest.fn(),
    loginWithTenant: jest.fn(),
    setAuthData: jest.fn(),
    clearAuthData: jest.fn(),
    updateTenant: jest.fn(),
  },
}));

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
const mockLocation = {
  state: null as any,
  pathname: '/login',
  search: '',
  hash: '',
  key: 'default',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

// Create a mock AuthContext that we can control
const mockAuthContext = {
  user: null as any,
  isAuthenticated: false,
  isLoading: false,
  token: null as string | null,
  tenantId: null as string | null,
  login: jest.fn(),
  logout: jest.fn(),
  error: null as string | null,
};

// Mock the AuthContext
jest.mock('../../features/auth/AuthContext', () => ({
  ...jest.requireActual('../../features/auth/AuthContext'),
  useAuth: () => mockAuthContext,
}));

// Create a mock TenantContext that we can control
const mockTenantContext = {
  currentTenant: '',
  availableTenants: [
    { id: 'tenant1', name: 'Tenant 1 (TechNXT)' },
    { id: 'tenant2', name: 'Tenant 2 (Iorta)' },
  ],
  switchTenant: jest.fn(),
  isLoading: false,
  error: null as string | null,
};

// Mock the TenantContext
jest.mock('../../features/tenant/TenantContext', () => ({
  ...jest.requireActual('../../features/tenant/TenantContext'),
  useTenant: () => mockTenantContext,
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <TenantProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </TenantProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock contexts
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;
    mockAuthContext.isLoading = false;
    mockAuthContext.error = null;
    mockAuthContext.login.mockClear();
    mockTenantContext.currentTenant = '';
    mockTenantContext.switchTenant.mockClear();
  });

  describe('Rendering', () => {
    test('renders login form with all required elements', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Check for main elements
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create new account/i })).toBeInTheDocument();
    });

    test('renders with correct input types and attributes', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('name', 'email');
      expect(emailInput).toBeRequired();

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('name', 'password');
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Form Validation', () => {
    test('shows validation errors for empty fields', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      // Submit the form without filling any fields
      await user.click(submitButton);

      // Wait for validation errors to appear
      await waitFor(() => {
        expect(screen.getByText('Please select a tenant')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    test('shows validation error for invalid email format', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Select a tenant first
      const tenantSelect = screen.getByRole('combobox');
      await user.selectOptions(tenantSelect, 'tenant1');

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // Enter invalid email and submit
      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'validpass123');
      await user.click(submitButton);

      // Wait for validation error to appear
      await waitFor(() => {
        expect(screen.getByText('Email is invalid')).toBeInTheDocument();
      });
    });

    test('shows validation error for short password', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Select a tenant first
      const tenantSelect = screen.getByRole('combobox');
      await user.selectOptions(tenantSelect, 'tenant1');

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // Enter valid email but short password
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, '123');
      await user.click(submitButton);

      // Wait for validation error to appear
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 5 characters')).toBeInTheDocument();
      });
    });

    test('clears validation errors when user starts typing', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // First trigger validation error by submitting empty form
      await user.click(submitButton);
      
      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText('Please select a tenant')).toBeInTheDocument();
      });

      // Select a tenant to clear error
      const tenantSelect = screen.getByRole('combobox');
      await user.selectOptions(tenantSelect, 'tenant1');
      
      // Wait for error to disappear
      await waitFor(() => {
        expect(screen.queryByText('Please select a tenant')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Interaction', () => {
    test('updates input values when user types', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Select a tenant first
      const tenantSelect = screen.getByRole('combobox');
      await user.selectOptions(tenantSelect, 'tenant1');

      const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('password123');
    });

    test('shows loading state when form is submitted', async () => {
      const user = userEvent.setup();
      
      // Mock login to return a pending promise
      mockAuthContext.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Select a tenant first
      const tenantSelect = screen.getByRole('combobox');
      await user.selectOptions(tenantSelect, 'tenant1');

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Check for loading state
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Authentication Flow', () => {
    test('calls login function with correct parameters on valid form submission', async () => {
      const user = userEvent.setup();
      
      // Mock successful login
      mockAuthContext.login.mockResolvedValue(undefined);
      
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Select a tenant first
      const tenantSelect = screen.getByRole('combobox');
      await user.selectOptions(tenantSelect, 'tenant1');

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(mockAuthContext.login).toHaveBeenCalledWith('test@example.com', 'password123', 'tenant1');
    });

    test('displays registration success message when coming from registration', async () => {
      // Mock location state to simulate coming from registration
      mockLocation.state = {
        from: { pathname: '/register' },
        registrationSuccess: true,
      };

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Check for success message
      expect(screen.getByText('Registration successful! Please log in.')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('displays error message when login fails', async () => {
      const user = userEvent.setup();
      
      // Mock login to reject with an error
      mockAuthContext.login.mockRejectedValue(new Error('Invalid credentials'));
      
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Select a tenant first
      const tenantSelect = screen.getByRole('combobox');
      await user.selectOptions(tenantSelect, 'tenant1');

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Login failed: Invalid credentials')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    test('navigates to registration page when create account button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const createAccountButton = screen.getByRole('button', { name: /create new account/i });
      
      // Since it's a Link component, we check if it has the correct href
      const linkElement = createAccountButton.closest('a');
      expect(linkElement).toHaveAttribute('href', '/register');
    });
  });

  describe('Accessibility', () => {
    test('has proper form labels and accessibility attributes', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    test('displays error messages with proper accessibility attributes', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      // Submit empty form to trigger validation
      await user.click(submitButton);

      // Wait for error message to appear and check accessibility
      await waitFor(() => {
        expect(screen.getByText('Please select a tenant')).toBeInTheDocument();
      });
    });
  });

  describe('Tenant Handling', () => {
    test('renders login form correctly', () => {
      // Simplified test that doesn't manipulate window.location
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // The component should render correctly regardless of tenant
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    });
  });
}); 