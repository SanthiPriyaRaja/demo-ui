import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../features/tenant/TenantContext';
import { useTenantTheme } from '../features/theme/TenantThemeContext';
import { useToast } from '../features/toast/ToastContext';
import type { Lead, LeadTab } from '../types/Lead';
import { leadService } from '../services/leadService';
import { LeadCard } from '../components/LeadCard';
import { Button } from '../components/ui/Button';
import { AddLeadModal } from '../components/AddLeadModal';
import { FilterLeadsModal, type LeadFilters } from '../components/FilterLeadsModal';

export const Leads: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [activeTab, setActiveTab] = useState<LeadTab>('All');
    const [loading, setLoading] = useState(true);
    const { currentTenant } = useTenant();
    const { colors } = useTenantTheme();
    const { showSuccess, showError } = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState<LeadFilters>({});
    const itemsPerPage = 10;

    const tabs: LeadTab[] = ['All', 'Open', 'Converted', 'Rejected', 'Discarded'];

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                const data = await leadService.getLeads(currentTenant, {
                    ...filters,
                    leadStatus: activeTab !== 'All' ? activeTab : filters.leadStatus
                });
                setLeads(data);
            } catch (err) {
                showError('Failed to fetch leads. Please try again later.');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, [currentTenant, activeTab, filters]);

    const handleAddLead = async (newLead: Partial<Lead>) => {
        try {
            const createdLead = await leadService.createLead(currentTenant, newLead);
            setLeads(prev => [createdLead, ...prev]);
            showSuccess('Lead created successfully!');
            setIsAddModalOpen(false);
        } catch (error) {
            // Check if it's our custom LeadError
            if (error instanceof Error) {
                showError(error.message);
            } else {
                showError('Failed to add lead. Please try again.');
            }
        }
    };

    const handleApplyFilters = (newFilters: LeadFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const filteredLeads = leads;
    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentLeads = filteredLeads.slice(startIndex, endIndex);

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            {/* Header */}
            <header className={`bg-gradient-to-r ${colors.headerFrom} ${colors.headerTo} border-b border-white/10`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col py-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    Leads
                                </h1>
                                <div className="flex items-center space-x-2 text-sm text-white/80 mt-1">
                                    <Link to={`/dashboard/${currentTenant}`} className="hover:text-white transition-colors duration-200">Dashboard</Link>
                                    <span>›</span>
                                    <span>Leads</span>
                                </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
                                {currentTenant}
                            </span>
                        </div>

                        {/* Tabs and Actions */}
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 
                                            ${activeTab === tab 
                                                ? 'bg-white text-gray-900' 
                                                : 'text-white/70 hover:text-white hover:bg-white/10'
                                            }`
                                        }
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-current focus:ring-white/60 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Lead
                                </button>
                                <button
                                    onClick={() => setIsFilterModalOpen(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-current focus:ring-white/60 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filter Leads
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div 
                            className={`animate-spin rounded-full h-12 w-12 border-b-2 ${colors.text.secondary}`}
                            role="status"
                            aria-label="Loading leads"
                        />
                    </div>
                ) : (
                    <>
                        {/* Empty State */}
                        {leads.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="flex justify-center">
                                    <div className={`w-20 h-20 bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} rounded-2xl flex items-center justify-center mb-4`}>
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className={`text-xl font-semibold ${colors.text.primary} mb-2`}>No Leads Found</h3>
                                <p className={`text-sm ${colors.text.muted} mb-6`}>
                                    {activeTab === 'All' && !Object.keys(filters).length
                                        ? "You haven't added any leads yet. Get started by adding your first lead!"
                                        : "No leads match your current filters. Try adjusting your filters or switching tabs."}
                                </p>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        variant="primary"
                                        onClick={() => setIsAddModalOpen(true)}
                                        className={`${colors.buttonPrimary} shadow-lg`}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Your First Lead
                                    </Button>
                                    {(activeTab !== 'All' || Object.keys(filters).length > 0) && (
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setActiveTab('All');
                                                setFilters({});
                                            }}
                                            className={`${colors.buttonSecondary} shadow-lg`}
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Reset Filters
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Leads Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {currentLeads.map((lead) => (
                                        <LeadCard key={lead._id} lead={lead} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {leads.length > 0 && (
                                    <div className="flex justify-between items-center mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-3
                                        shadow-[0_3px_10px_rgb(0,0,0,0.1),0_0_3px_rgb(0,0,0,0.05)] 
                                        hover:shadow-[0_10px_15px_-3px_rgb(0,0,0,0.1),0_4px_6px_-2px_rgb(0,0,0,0.05)]
                                        transition-all duration-300">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="secondary"
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                ‹
                                            </Button>
                                            <span className={`px-4 py-2 ${colors.text.primary}`}>{currentPage}</span>
                                            <Button
                                                variant="secondary"
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                            >
                                                ›
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={colors.text.muted}>{itemsPerPage} / page</span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                {/* Modals */}
                <AddLeadModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddLead}
                />
                <FilterLeadsModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    onApplyFilters={handleApplyFilters}
                    initialFilters={filters}
                />
            </main>
        </div>
    );
};