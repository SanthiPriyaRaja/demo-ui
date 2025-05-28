import { Tenant } from '../types/tenant';

export const tenants: Record<string, Tenant> = {
  'localhost': {
    id: 'tenant1',
    name: 'Demo Tenant',
    theme: {
      primary: '#1a73e8',
      secondary: '#4285f4',
      accent: '#fbbc04',
    },
    logo: '/demo-logo.png',
    domain: 'localhost',
  },
  'tenant1.example.com': {
    id: 'tenant1',
    name: 'Tenant One',
    theme: {
      primary: '#2e7d32',
      secondary: '#4caf50',
      accent: '#81c784',
    },
    logo: '/tenant1-logo.png',
    domain: 'tenant1.example.com',
  },
  'tenant2.example.com': {
    id: 'tenant2',
    name: 'Tenant Two',
    theme: {
      primary: '#c62828',
      secondary: '#f44336',
      accent: '#e57373',
    },
    logo: '/tenant2-logo.png',
    domain: 'tenant2.example.com',
  },
}; 