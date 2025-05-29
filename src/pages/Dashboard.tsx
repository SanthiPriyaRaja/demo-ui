import React, { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { useTenant } from '../features/tenant/TenantContext';
import { useTenantTheme } from '../features/theme/TenantThemeContext';
import { Button } from '../components/ui/Button';
import { leadService } from '../services/leadService';
import type { Lead } from '../types/Lead';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentTenant, switchTenant, availableTenants } = useTenant();
  const { colors } = useTenantTheme();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadCounts, setLeadCounts] = useState({
    total: 0,
    open: 0,
    converted: 0,
    rejected: 0,
    discarded: 0
  });

  // Ensure tenant consistency
  useEffect(() => {
    // Only switch tenant if:
    // 1. We have a user
    // 2. User has a tenant
    // 3. Current tenant doesn't match user's tenant
    // 4. Current tenant is actually set (not empty)
    if (user?.tenant && 
        currentTenant && 
        user.tenant !== currentTenant) {
      console.log('Dashboard - Tenant mismatch detected:', {
        userTenant: user.tenant,
        currentTenant,
        action: 'Switching tenant with preserved auth'
      });
      // Switch tenant but preserve auth state since this is an initial sync
      switchTenant(user.tenant, true);
    }
  }, [user?.tenant, currentTenant, switchTenant]);

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

    if (currentTenant) {
      fetchLeads();
    }
  }, [currentTenant]);

  const handleLogout = () => {
    // Clear tenant state before logout
    localStorage.removeItem('selectedTenant');
    const url = new URL(window.location.href);
    url.searchParams.delete('tenant');
    window.history.replaceState({}, '', url.toString());
    
    // Then logout
    logout();
    navigate('/login');
  };

  // Get tenant display name
  const getTenantDisplayName = (tenantId: string) => {
    const tenant = availableTenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : tenantId;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.background.light} via-white ${colors.background.medium}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} bg-clip-text text-transparent`}>
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, <span className={`font-semibold ${colors.text.secondary}`}>{user?.name}</span>!
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Logged in to: <span className={`font-medium ${colors.text.secondary}`}>{getTenantDisplayName(currentTenant)}</span>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info Card */}
          <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="px-6 py-6">
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} rounded-xl flex items-center justify-center`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className={`ml-3 text-lg font-semibold ${colors.text.primary}`}>
                  User Information
                </h3>
              </div>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className={`text-sm font-medium ${colors.text.muted}`}>Name</dt>
                  <dd className={`text-sm font-semibold ${colors.text.primary}`}>{user?.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={`text-sm font-medium ${colors.text.muted}`}>Email</dt>
                  <dd className={`text-sm font-semibold ${colors.text.primary}`}>{user?.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={`text-sm font-medium ${colors.text.muted}`}>User ID</dt>
                  <dd className={`text-sm font-mono ${colors.text.primary}`}>{user?.id}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Tenant Info Card */}
          <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="px-6 py-6">
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} rounded-xl flex items-center justify-center`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className={`ml-3 text-lg font-semibold ${colors.text.primary}`}>
                  Tenant Information
                </h3>
              </div>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className={`text-sm font-medium ${colors.text.muted}`}>Current Tenant</dt>
                  <dd className={`text-sm font-semibold ${colors.badge}`}>
                    {getTenantDisplayName(currentTenant)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className={`text-sm font-medium ${colors.text.muted}`}>Backend API ID</dt>
                  <dd className={`text-sm font-semibold ${colors.badge}`}>
                    {user?.tenantId || 'Not set'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6">
          <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="px-6 py-6">
              <div className="flex items-center mb-6">
                <div className={`w-10 h-10 bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} rounded-xl flex items-center justify-center`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className={`ml-3 text-lg font-semibold ${colors.text.primary}`}>
                  Statistics
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`text-center p-4 bg-gradient-to-br ${colors.background.light} ${colors.background.medium} rounded-xl`}>
                  <div className={`text-3xl font-bold ${colors.text.secondary} mb-1`}>
                    {availableTenants.length}
                  </div>
                  <div className={`text-sm ${colors.text.muted} font-medium`}>Total Tenants</div>
                </div>
                <div className={`text-center p-4 bg-gradient-to-br ${colors.background.light} ${colors.background.medium} rounded-xl`}>
                  <div className={`text-3xl font-bold ${colors.text.secondary} mb-1`}>
                    {leadCounts.total}
                  </div>
                  <div className={`text-sm ${colors.text.muted} font-medium`}>Total Leads</div>
                </div>
                <div className={`text-center p-4 bg-gradient-to-br ${colors.background.light} ${colors.background.medium} rounded-xl`}>
                  <div className={`text-3xl font-bold ${colors.text.secondary} mb-1`}>
                    {leadCounts.converted}
                  </div>
                  <div className={`text-sm ${colors.text.muted} font-medium`}>Converted Leads</div>
                </div>
                <div className={`text-center p-4 bg-gradient-to-br ${colors.background.light} ${colors.background.medium} rounded-xl`}>
                  <div className={`text-3xl font-bold ${colors.text.secondary} mb-1`}>
                    {leadCounts.total > 0 ? ((leadCounts.converted / leadCounts.total) * 100).toFixed(1) : '0.0'}%
                  </div>
                  <div className={`text-sm ${colors.text.muted} font-medium`}>Conversion Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Section */}
        <div className="mt-6">
          <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="px-6 py-6">
              <div className="flex items-center mb-6">
                <div className={`w-10 h-10 bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} rounded-xl flex items-center justify-center`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className={`ml-3 text-lg font-semibold ${colors.text.primary}`}>
                  Lead Management
                </h3>
                <Button 
                  variant="secondary"
                  className="ml-auto text-sm"
                  onClick={() => navigate('/leads')}
                >
                  View All Leads
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className={`text-center p-4 bg-gradient-to-br ${colors.background.light} ${colors.background.medium} rounded-xl`}>
                  <div className={`text-3xl font-bold ${colors.text.secondary} mb-1`}>
                    {leadCounts.total}
                  </div>
                  <div className={`text-sm ${colors.text.muted} font-medium`}>Total Leads</div>
                </div>
                <div className={`text-center p-4 bg-gradient-to-br ${colors.background.light} ${colors.background.medium} rounded-xl`}>
                  <div className={`text-3xl font-bold ${colors.text.secondary} mb-1`}>
                    {leadCounts.open}
                  </div>
                  <div className={`text-sm ${colors.text.muted} font-medium`}>Open</div>
                </div>
                <div className={`text-center p-4 bg-gradient-to-br ${colors.background.light} ${colors.background.medium} rounded-xl`}>
                  <div className={`text-3xl font-bold ${colors.text.secondary} mb-1`}>
                    {leadCounts.rejected}
                  </div>
                  <div className={`text-sm ${colors.text.muted} font-medium`}>Rejected</div>
                </div>
                <div className={`text-center p-4 bg-gradient-to-br ${colors.background.light} ${colors.background.medium} rounded-xl`}>
                  <div className={`text-3xl font-bold ${colors.text.secondary} mb-1`}>
                    {leadCounts.converted}
                  </div>
                  <div className={`text-sm ${colors.text.muted} font-medium`}>Converted</div>
                </div>
                <div className={`text-center p-4 bg-gradient-to-br ${colors.background.light} ${colors.background.medium} rounded-xl`}>
                  <div className={`text-3xl font-bold ${colors.text.secondary} mb-1`}>
                    {leadCounts.discarded}
                  </div>
                  <div className={`text-sm ${colors.text.muted} font-medium`}>Discarded</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 