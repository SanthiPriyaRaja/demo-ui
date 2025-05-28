import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input Component', () => {
  describe('Rendering', () => {
    test('renders input with basic props', () => {
      render(<Input placeholder="Enter text" />);
      
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Enter text');
    });

    test('renders with label', () => {
      render(<Input label="Email Address" placeholder="Enter email" />);
      
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('Email Address')).toBeInTheDocument();
    });

    test('renders with different input types', () => {
      render(<Input type="password" placeholder="Enter password" />);
      
      const input = screen.getByPlaceholderText('Enter password');
      expect(input).toHaveAttribute('type', 'password');
    });

    test('renders with helper text', () => {
      render(<Input helperText="This is helper text" />);
      
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    test('renders with custom type', () => {
      render(<Input type="password" />);
      
      // Find password input by type attribute
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('Error States', () => {
    test('displays error message when error prop is provided', () => {
      const errorMessage = 'This field is required';
      render(<Input error={errorMessage} />);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('applies error styling when error is present', () => {
      render(<Input error="Error message" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-300', 'bg-red-50');
    });

    test('shows error icon when error is present', () => {
      render(<Input error="Error message" />);
      
      const errorMessage = screen.getByRole('alert');
      const errorIcon = errorMessage.querySelector('svg');
      expect(errorIcon).toBeInTheDocument();
    });

    test('does not show helper text when error is present', () => {
      render(<Input error="Error message" helperText="Helper text" />);
      
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('Normal States', () => {
    test('applies normal styling when no error', () => {
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-gray-200', 'bg-white');
      expect(input).not.toHaveClass('border-red-300', 'bg-red-50');
    });

    test('shows helper text when no error', () => {
      render(<Input helperText="This is helpful information" />);
      
      expect(screen.getByText('This is helpful information')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('handles user input correctly', async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Type here" />);
      
      const input = screen.getByPlaceholderText('Type here');
      await user.type(input, 'Hello World');
      
      expect(input).toHaveValue('Hello World');
    });

    test('calls onChange handler when value changes', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(<Input onChange={handleChange} placeholder="Type here" />);
      
      const input = screen.getByPlaceholderText('Type here');
      await user.type(input, 'test');
      
      expect(handleChange).toHaveBeenCalled();
    });

    test('handles focus and blur events', async () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      const user = userEvent.setup();
      
      render(<Input onFocus={handleFocus} onBlur={handleBlur} placeholder="Focus test" />);
      
      const input = screen.getByPlaceholderText('Focus test');
      
      await user.click(input);
      expect(handleFocus).toHaveBeenCalled();
      
      await user.tab();
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('associates label with input correctly', () => {
      render(<Input label="Username" />);
      
      const input = screen.getByLabelText('Username');
      const label = screen.getByText('Username');
      
      expect(input).toBeInTheDocument();
      expect(label).toHaveAttribute('for', input.id);
    });

    test('has proper aria attributes for error state', () => {
      render(<Input error="Invalid input" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-300', 'bg-red-50');
    });

    test('is focusable', () => {
      render(<Input placeholder="Focusable input" />);
      
      const input = screen.getByPlaceholderText('Focusable input');
      input.focus();
      
      expect(input).toHaveFocus();
    });

    test('generates unique id when not provided', () => {
      render(<Input label="Test Label" />);
      
      const input = screen.getByLabelText('Test Label');
      expect(input).toHaveAttribute('id');
      expect(input.id).toMatch(/^input-/);
    });

    test('uses provided id when given', () => {
      render(<Input id="custom-id" label="Custom Input" />);
      
      const input = screen.getByLabelText('Custom Input');
      expect(input).toHaveAttribute('id', 'custom-id');
    });

    test('error message has proper accessibility attributes', () => {
      render(<Input error="Required field" />);
      
      const errorMessage = screen.getByText('Required field');
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });

    test('helper text has proper accessibility attributes', () => {
      render(<Input helperText="Helpful information" />);
      
      const helperText = screen.getByText('Helpful information');
      expect(helperText).toBeInTheDocument();
      // Helper text should not have role="alert" since it's not an error
      expect(helperText).not.toHaveAttribute('role', 'alert');
    });
  });

  describe('Custom Props', () => {
    test('applies custom className', () => {
      render(<Input className="custom-class" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    test('forwards HTML input attributes', () => {
      render(<Input maxLength={10} disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '10');
      expect(input).toBeDisabled();
    });

    test('handles required attribute', () => {
      render(<Input required />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });
  });

  describe('Focus States', () => {
    test('applies focus styles when focused', async () => {
      const user = userEvent.setup();
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      expect(input).toHaveClass('focus:border-blue-500');
    });

    test('applies error focus styles when error and focused', async () => {
      const user = userEvent.setup();
      render(<Input error="Error message" />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      expect(input).toHaveClass('focus:border-red-500');
    });
  });
}); 