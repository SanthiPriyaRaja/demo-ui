import { leadService } from '../leadService';
import axios from 'axios';
import type { Lead } from '../../types/Lead';

// Mock the config module
jest.mock('../../config', () => ({
  getApiUrl: () => 'http://localhost:3000'
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Create a mock axios instance
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
};

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance)
}));

describe('leadService', () => {
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
    leadStatus: 'Open' as const,
    leadProgress: 'New Lead Entry',
    allocatorRemarks: 'Test remarks',
    userRemarks: 'Test user remarks',
    appointmentDate: '2024-03-01T10:00:00.000Z',
    createdAt: '2024-03-01T10:00:00.000Z',
    updatedAt: '2024-03-01T10:00:00.000Z',
    __v: 0
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  describe('getLeads', () => {
    it('should fetch leads successfully', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: [mockLead] });

      const result = await leadService.getLeads('tenant1');
      expect(result).toEqual([mockLead]);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/lead');
    });

    it('should handle errors and return empty array', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await leadService.getLeads('tenant1');
      expect(result).toEqual([]);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/lead');
    });

    it('should apply filters correctly', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: [mockLead] });

      await leadService.getLeads('tenant1', { leadStatus: 'Open' });
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/lead?leadStatus=Open');
    });
  });

  describe('createLead', () => {
    it('should create lead successfully', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockLead });

      const result = await leadService.createLead('tenant1', mockLead);
      expect(result).toEqual(mockLead);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/lead', mockLead);
    });

    it('should handle errors correctly', async () => {
      const error = new Error('Network error');
      mockAxiosInstance.post.mockRejectedValueOnce(error);

      await expect(leadService.createLead('tenant1', mockLead)).rejects.toThrow('Network error');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/lead', mockLead);
    });
  });
}); 