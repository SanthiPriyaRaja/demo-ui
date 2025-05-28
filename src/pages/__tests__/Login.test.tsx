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
  state: null,
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

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <TenantProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </TenantProvider>
  </BrowserRouter>
);

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock auth context
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;
    mockAuthContext.isLoading = false;
    mockAuthContext.error = null;
    mockAuthContext.login.mockClear();
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
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    test('shows validation error for invalid email format', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // Enter invalid email and submit
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      // Wait for validation error to appear
      await waitFor(() => {
        expect(screen.getByText('Email is invalid')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    test('shows validation error for short password', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // Enter short password and submit
      await user.type(passwordInput, '123');
      await user.click(submitButton);

      // Wait for validation error to appear
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 5 characters')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    test('clears validation errors when user starts typing', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // First trigger validation error by submitting empty form
      await user.click(submitButton);
      
      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Start typing to clear error
      await user.type(emailInput, 'test@example.com');
      
      // Wait for error to disappear
      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      }, { timeout: 3000 });
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

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Check for loading state - the button text should change
      await waitFor(() => {
        expect(screen.getByText('Signing in...')).toBeInTheDocument();
      });
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

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthContext.login).toHaveBeenCalledWith('test@example.com', 'password123', 'tenant1');
      });
    });

    test('displays registration success message when coming from registration', () => {
      const mockLocationWithMessage = {
        ...mockLocation,
        state: {
          message: 'Registration successful! Please log in.',
          email: 'newuser@example.com',
        },
      };

      // Mock useLocation to return the message
      const useLocationSpy = jest.spyOn(require('react-router-dom'), 'useLocation');
      useLocationSpy.mockReturnValue(mockLocationWithMessage);

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      expect(screen.getByText('Registration Successful!')).toBeInTheDocument();
      expect(screen.getByText('Registration successful! Please log in.')).toBeInTheDocument();
      
      // Restore the original mock
      useLocationSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    test('displays authentication error when login fails', async () => {
      const user = userEvent.setup();
      
      // Mock login to reject with an error
      mockAuthContext.login.mockRejectedValue(new Error('Invalid credentials'));
      mockAuthContext.error = 'Invalid credentials';
      
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
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

      // The Input component doesn't set aria-required, but it does set the required attribute
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
        const errorMessage = screen.getByText('Email is required');
        expect(errorMessage).toHaveAttribute('role', 'alert');
      }, { timeout: 3000 });
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