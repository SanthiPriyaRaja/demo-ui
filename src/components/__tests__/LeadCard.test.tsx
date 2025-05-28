import React from 'react';
import { render, screen } from '@testing-library/react';
import { LeadCard } from '../LeadCard';
import type { Lead } from '../../types/Lead';

const mockLead: Lead = {
  _id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  mobileNo: '1234567890',
  landlineNo: '0987654321',
  province: 'Punjab',
  city: 'Lahore',
  leadType: 'Sales',
  leadStatus: 'Open',
  leadProgress: 'New Lead Entry',
  allocatorRemarks: 'Test remarks',
  userRemarks: 'Test user remarks',
  appointmentDate: '2024-03-01T00:00:00.000Z',
  createdAt: '2024-03-01T00:00:00.000Z',
  updatedAt: '2024-03-01T00:00:00.000Z',
  __v: 0
};

describe('LeadCard', () => {
  it('renders basic lead information', () => {
    render(<LeadCard lead={mockLead} />);
    // Use regex to match text that might be split across elements
    expect(screen.getByText(/John/)).toBeInTheDocument();
    expect(screen.getByText(/Doe/)).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText(/Lahore/)).toBeInTheDocument();
    expect(screen.getByText(/Punjab/)).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<LeadCard lead={mockLead} />);
    const statusBadge = screen.getByText('Open');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('formats dates correctly', () => {
    render(<LeadCard lead={mockLead} />);
    const dates = screen.getAllByText('Mar 1, 2024');
    expect(dates).toHaveLength(2); // One for appointment date and one for created date
    expect(dates[0]).toBeInTheDocument();
    expect(dates[1]).toBeInTheDocument();
  });

  it('renders lead type and progress', () => {
    render(<LeadCard lead={mockLead} />);
    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(screen.getByText('New Lead Entry')).toBeInTheDocument();
  });

  it('renders remarks', () => {
    render(<LeadCard lead={mockLead} />);
    expect(screen.getByText('Test user remarks')).toBeInTheDocument();
  });
}); 