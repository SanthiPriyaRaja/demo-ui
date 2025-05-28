import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    test('renders button with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    test('renders with default variant and size', () => {
      render(<Button>Default Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600');
      expect(button).toHaveClass('px-6', 'py-3', 'text-sm', 'h-11');
    });
  });

  describe('Variants', () => {
    test('renders primary variant correctly', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600');
      expect(button).toHaveClass('text-white');
    });

    test('renders secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('bg-white', 'text-gray-700');
      expect(button).toHaveClass('border-2', 'border-gray-200');
    });

    test('renders danger variant correctly', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('bg-gradient-to-r', 'from-red-600', 'to-red-700');
      expect(button).toHaveClass('text-white');
    });
  });

  describe('Sizes', () => {
    test('renders small size correctly', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm', 'h-9');
    });

    test('renders medium size correctly', () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('px-6', 'py-3', 'text-sm', 'h-11');
    });

    test('renders large size correctly', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('px-8', 'py-4', 'text-base', 'h-12');
    });
  });

  describe('Loading State', () => {
    test('shows loading spinner when isLoading is true', () => {
      render(<Button isLoading>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg');
      
      expect(button).toBeDisabled();
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    test('hides loading spinner when isLoading is false', () => {
      render(<Button isLoading={false}>Normal Button</Button>);
      
      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg');
      
      expect(button).not.toBeDisabled();
      expect(spinner).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    test('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    test('is disabled when isLoading is true', () => {
      render(<Button isLoading>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    test('is not disabled by default', () => {
      render(<Button>Normal Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Event Handling', () => {
    test('calls onClick handler when clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Clickable Button</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('does not call onClick when loading', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick} isLoading>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Custom Props', () => {
    test('applies custom className', () => {
      render(<Button className="custom-class">Custom Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    test('forwards HTML button attributes', () => {
      render(<Button type="submit" id="submit-btn">Submit</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('id', 'submit-btn');
    });
  });

  describe('Accessibility', () => {
    test('has proper button role', () => {
      render(<Button>Accessible Button</Button>);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('is focusable when not disabled', () => {
      render(<Button>Focusable Button</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    test('is not focusable when disabled', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).not.toHaveFocus();
    });
  });
}); 