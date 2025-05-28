import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Leads } from '../Leads';
import { leadService } from '../../services/leadService';
import type { Lead } from '../../types/Lead';

// Mock the config module
jest.mock('../../config', () => ({
  getApiUrl: () => 'http://localhost:3000'
}));

// Mock the leadService
jest.mock('../../services/leadService');

// Mock the TenantContext
jest.mock('../../features/tenant/TenantContext', () => ({
  useTenant: () => ({
    currentTenant: 'tenant1',
    availableTenants: [
      { id: 'tenant1', name: 'Tenant 1' },
      { id: 'tenant2', name: 'Tenant 2' }
    ]
  })
}));

describe('Leads Page', () => {
  const mockLeads: Lead[] = [
    {
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
      appointmentDate: '2024-03-01T10:00:00.000Z',
      createdAt: '2024-03-01T10:00:00.000Z',
      updatedAt: '2024-03-01T10:00:00.000Z',
      __v: 0
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (leadService.getLeads as jest.Mock).mockResolvedValue(mockLeads);
  });

  it('renders leads page with leads', async () => {
    render(
      <BrowserRouter>
        <Leads />
      </BrowserRouter>
    );

    // Wait for leads to load
    await waitFor(() => {
      // Use regex to match text that might be split across elements
      expect(screen.getByText(/John/)).toBeInTheDocument();
      expect(screen.getByText(/Doe/)).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    render(
      <BrowserRouter>
        <Leads />
      </BrowserRouter>
    );

    // Look for the loading spinner element
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message when leads fetch fails', async () => {
    (leadService.getLeads as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <Leads />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Get all error messages
      const errorMessages = screen.getAllByText(/failed to fetch leads/i);
      // Verify at least one error message is shown
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it('filters leads by status', async () => {
    render(
      <BrowserRouter>
        <Leads />
      </BrowserRouter>
    );

    // Click on the Open tab
    const openTab = screen.getByText('Open');
    fireEvent.click(openTab);

    await waitFor(() => {
      expect(leadService.getLeads).toHaveBeenCalledWith('tenant1', expect.objectContaining({
        leadStatus: 'Open'
      }));
    });
  });
}); 