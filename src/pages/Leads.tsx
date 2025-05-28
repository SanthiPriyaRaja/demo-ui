import React, { useEffect, useState } from 'react';
import { useTenant } from '../features/tenant/TenantContext';
import type { Lead, LeadTab } from '../types/Lead';
import { leadService } from '../services/leadService';
import { LeadCard } from '../components/LeadCard';
import { Button } from '../components/ui/Button';
import { AddLeadModal } from '../components/AddLeadModal';

const getTenantColors = (tenant: string) => {
    switch (tenant) {
        case 'tenant1':
            return {
                gradientFrom: 'from-blue-600',
                gradientTo: 'to-indigo-600',
                headerFrom: 'from-blue-500',
                headerTo: 'to-indigo-500',
                buttonPrimary: 'bg-blue-600 hover:bg-blue-700',
                buttonSecondary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
                badge: 'bg-blue-100 text-blue-800'
            };
        case 'tenant2':
            return {
                gradientFrom: 'from-emerald-600',
                gradientTo: 'to-teal-600',
                headerFrom: 'from-emerald-500',
                headerTo: 'to-teal-500',
                buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700',
                buttonSecondary: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
                badge: 'bg-emerald-100 text-emerald-800'
            };
        case 'tenant3':
            return {
                gradientFrom: 'from-purple-600',
                gradientTo: 'to-pink-600',
                headerFrom: 'from-purple-500',
                headerTo: 'to-pink-500',
                buttonPrimary: 'bg-purple-600 hover:bg-purple-700',
                buttonSecondary: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
                badge: 'bg-purple-100 text-purple-800'
            };
        default:
            return {
                gradientFrom: 'from-gray-600',
                gradientTo: 'to-slate-600',
                headerFrom: 'from-gray-500',
                headerTo: 'to-slate-500',
                buttonPrimary: 'bg-gray-600 hover:bg-gray-700',
                buttonSecondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
                badge: 'bg-gray-100 text-gray-800'
            };
    }
};

export const Leads: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [activeTab, setActiveTab] = useState<LeadTab>('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentTenant } = useTenant();
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const itemsPerPage = 10;

    const tenantColors = getTenantColors(currentTenant);
    const tabs: LeadTab[] = ['All', 'In Progress', 'Rejected', 'Archived'];

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await leadService.getLeads(currentTenant);
                setLeads(data);
            } catch (err) {
                setError('Failed to fetch leads. Please try again later.');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, [currentTenant]);

    const filteredLeads = activeTab === 'All' 
        ? leads 
        : leads.filter(lead => lead.leadStatus === activeTab);

    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentLeads = filteredLeads.slice(startIndex, endIndex);

    const handleAddLead = async (newLead: Partial<Lead>) => {
        try {
            // In a real application, you would make an API call here
            // For now, we'll just add it to the local state
            const lead = {
                ...newLead,
                id: Date.now().toString(), // temporary ID generation
            } as Lead;
            
            setLeads(prev => [lead, ...prev]);
        } catch (error) {
            console.error('Error adding lead:', error);
            setError('Failed to add lead. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            {/* Header */}
            <header className={`bg-gradient-to-r ${tenantColors.headerFrom} ${tenantColors.headerTo} border-b border-white/10`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    Leads
                                </h1>
                                <div className="flex items-center space-x-2 text-sm text-white/80 mt-1">
                                    <span>Dashboard</span>
                                    <span>›</span>
                                    <span>Application-Listing</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tenantColors.badge}`}>
                                    {currentTenant}
                                </span>
                            </div>
                        </div>
                        
                        {/* Tabs and Add Button */}
                        <div className="flex justify-between items-center mt-6">
                            <div className="flex flex-wrap gap-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-full transition-all duration-200 ${
                                            activeTab === tab 
                                                ? 'bg-white text-gray-900 shadow-md'
                                                : 'text-white/90 hover:bg-white/10'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <Button
                                variant="primary"
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-white text-gray-900 hover:bg-gray-50 shadow-md"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Lead
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                {/* Tabs and Content */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100
                    shadow-[0_3px_10px_rgb(0,0,0,0.1),0_0_3px_rgb(0,0,0,0.05)] 
                    hover:shadow-[0_20px_25px_-5px_rgb(0,0,0,0.1),0_10px_10px_-5px_rgb(0,0,0,0.04)] 
                    transition-all duration-300">
                    <div className="px-6 py-4">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4
                                shadow-[0_2px_8px_rgb(0,0,0,0.08)]">
                                {error}
                            </div>
                        )}

                        {/* Loading State */}
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${tenantColors.buttonPrimary.split(' ')[0].replace('bg-', 'border-')}`}></div>
                            </div>
                        ) : (
                            <>
                                {/* Results Count */}
                                <div className="text-gray-600 mb-4 px-1">
                                    {`${startIndex + 1} to ${Math.min(endIndex, filteredLeads.length)} out of ${filteredLeads.length} records`}
                                </div>

                                {/* Lead Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentLeads.length > 0 ? (
                                        currentLeads.map((lead) => (
                                            <LeadCard key={lead.email} lead={lead} />
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-center text-gray-500 py-8 bg-white/80 backdrop-blur-sm rounded-xl
                                            shadow-[0_2px_8px_rgb(0,0,0,0.08)]">
                                            No applications found for this status.
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-between items-center mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-3
                                    shadow-[0_3px_10px_rgb(0,0,0,0.1),0_0_3px_rgb(0,0,0,0.05)] 
                                    hover:shadow-[0_10px_15px_-3px_rgb(0,0,0,0.1),0_4px_6px_-2px_rgb(0,0,0,0.05)]
                                    transition-all duration-300">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${tenantColors.buttonSecondary}`}
                                        >
                                            ‹
                                        </button>
                                        <span className="px-4 py-2 text-gray-700">{currentPage}</span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${tenantColors.buttonSecondary}`}
                                        >
                                            ›
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">{itemsPerPage} / page</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>

            {/* Add Lead Modal */}
            <AddLeadModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddLead}
            />
        </div>
    );
}; 