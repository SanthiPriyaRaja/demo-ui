import React, { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { useTenant } from '../features/tenant/TenantContext';
import { Button } from '../components/ui/Button';
import { leadService } from '../services/leadService';
import type { Lead } from '../types/Lead';

export const Dashboard: React.FC = () => {
  const { user, logout, token, tenantId } = useAuth();
  const { currentTenant, switchTenant, availableTenants } = useTenant();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadCounts, setLeadCounts] = useState({
    total: 0,
    open: 0,
    converted: 0,
    rejected: 0,
    discarded: 0
  });

  // Get stored tenant information
  const storedSelectedTenant = localStorage.getItem('selectedTenant');
  const storedTenantId = localStorage.getItem('tenantId');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await leadService.getLeads(currentTenant);
        setLeads(data);
        
        // Calculate counts
        setLeadCounts({
          total: data.length,
          open: data.filter(lead => lead.leadStatus === 'Open').length,
          converted: data.filter(lead => lead.leadStatus === 'Converted').length,
          rejected: data.filter(lead => lead.leadStatus === 'Rejected').length,
          discarded: data.filter(lead => lead.leadStatus === 'Discarded').length
        });
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchLeads();
  }, [currentTenant]);

  const handleLogout = () => {
    logout();
  };

  // Get tenant display name
  const getTenantDisplayName = (tenantId: string) => {
    const tenant = availableTenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : tenantId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, <span className="font-semibold">{user?.name}</span>!
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Logged in to: <span className="font-medium text-blue-600">{getTenantDisplayName(user?.tenant || '')}</span>
              </p>
            </div>
            <Button variant="secondary" onClick={handleLogout} className="shadow-md">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* User Info Card */}
            <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="px-6 py-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    User Information
                  </h3>
                </div>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="text-sm font-semibold text-gray-900">{user?.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm font-semibold text-gray-900">{user?.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">User ID</dt>
                    <dd className="text-sm font-mono text-gray-900">{user?.id}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Tenant Info Card */}
            <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="px-6 py-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    Tenant Information
                  </h3>
                </div>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Selected at Login</dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user?.tenant || storedSelectedTenant || 'Not set'}
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Backend API ID</dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {user?.tenantId || storedTenantId || 'Not set'}
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Current URL Tenant</dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {currentTenant}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Authentication Info Card */}
            <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="px-6 py-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    Authentication
                  </h3>
                </div>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Authenticated
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Login Time</dt>
                    <dd className="text-xs font-mono text-gray-900 break-all">
                      {token ? new Date().toLocaleTimeString() : 'Not available'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">High Security</dt>
                    <dd className="text-xs text-gray-600">
                      <div className="flex items-center">
                        {localStorage.getItem('user') ? (
                          <>
                            <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-green-600 font-medium">High Security Enabled</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-600 font-medium">Security Disabled</span>
                          </>
                        )}
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Leads Section */}
          <div className="mt-8">
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-100">
              <div className="px-6 py-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    Lead Management
                  </h3>
                  <Button 
                    variant="secondary"
                    className="ml-auto text-sm"
                    onClick={() => window.location.href = '/leads'}
                  >
                    View All Leads
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{leadCounts.total}</div>
                    <div className="text-sm text-blue-700 font-medium">Total Leads</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">{leadCounts.open}</div>
                    <div className="text-sm text-indigo-700 font-medium">Open</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                    <div className="text-3xl font-bold text-red-600 mb-1">{leadCounts.rejected}</div>
                    <div className="text-sm text-red-700 font-medium">Rejected</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    <div className="text-3xl font-bold text-gray-600 mb-1">{leadCounts.converted}</div>
                    <div className="text-sm text-gray-700 font-medium">Converted</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    <div className="text-3xl font-bold text-gray-600 mb-1">{leadCounts.discarded}</div>
                    <div className="text-sm text-gray-700 font-medium">Discarded</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-8">
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-100">
              <div className="px-6 py-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    Application Stats
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-1">1</div>
                    <div className="text-sm text-blue-700 font-medium">Active Users</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
                    <div className="text-sm text-green-700 font-medium">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{currentTenant}</div>
                    <div className="text-sm text-purple-700 font-medium">Current Tenant</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {new Date().toLocaleDateString()}
                    </div>
                    <div className="text-sm text-orange-700 font-medium">Today's Date</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 