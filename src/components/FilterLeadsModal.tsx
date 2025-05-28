import React, { useState } from 'react';
import { Button } from './ui/Button';
import { useTenant } from '../features/tenant/TenantContext';
import { getTenantColors } from '../utils/colors';

interface FilterLeadsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: LeadFilters) => void;
    initialFilters?: LeadFilters;
}

export interface LeadFilters {
    search?: string;
    leadStatus?: string;
    leadType?: string;
    leadProgress?: string;
    province?: string;
    city?: string;
}

const scrollbarHideStyles = `
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;            /* Chrome, Safari and Opera */
}

.floating-label {
    position: absolute;
    left: 1rem;
    top: 1rem;
    padding: 0 0.25rem;
    background-color: white;
    color: #6b7280;
    font-size: 0.875rem;
    transition: all 0.2s ease-in-out;
    transform-origin: left top;
    pointer-events: none;
}

.input-filled + .floating-label,
input:focus + .floating-label,
select + .floating-label,
textarea:focus + .floating-label {
    transform: translateY(-1.5rem) scale(0.85);
    color: #3b82f6;
}

.input-group:focus-within .floating-label {
    color: #3b82f6;
}
`;

export const FilterLeadsModal: React.FC<FilterLeadsModalProps> = ({ 
    isOpen, 
    onClose, 
    onApplyFilters,
    initialFilters = {}
}) => {
    const { currentTenant } = useTenant();
    const tenantColors = getTenantColors(currentTenant);
    const [filters, setFilters] = useState<LeadFilters>(initialFilters);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value || undefined // Only set if value is not empty
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onApplyFilters(filters);
        onClose();
    };

    const handleReset = () => {
        setFilters({});
        onApplyFilters({});
        onClose();
    };

    const handleClose = () => {
        setFilters(initialFilters);
        onClose();
    };

    if (!isOpen) return null;

    const inputGroupClasses = "relative border-2 border-gray-300 rounded-xl bg-white transition-all duration-200 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10";
    const inputClasses = "w-full px-4 pt-6 pb-2 rounded-xl bg-transparent focus:outline-none text-gray-900 text-base";
    const labelClasses = "floating-label";

    // Function to get the count of active filters
    const getActiveFilterCount = () => {
        return Object.values(filters).filter(value => value !== undefined && value !== '').length;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open':
                return 'bg-blue-100/20 text-blue-100 ring-1 ring-blue-500/30';
            case 'Converted':
                return 'bg-emerald-100/20 text-emerald-100 ring-1 ring-emerald-500/30';
            case 'Rejected':
                return 'bg-red-100/20 text-red-100 ring-1 ring-red-500/30';
            case 'Discarded':
                return 'bg-gray-100/20 text-gray-100 ring-1 ring-gray-500/30';
            default:
                return 'bg-white/20';
        }
    };

    const getProgressColor = (progress: string) => {
        switch (progress) {
            case 'New Lead Entry':
                return 'bg-blue-100/20 text-blue-100 ring-1 ring-blue-500/30';
            case 'Contacted':
                return 'bg-indigo-100/20 text-indigo-100 ring-1 ring-indigo-500/30';
            case 'Qualified':
                return 'bg-purple-100/20 text-purple-100 ring-1 ring-purple-500/30';
            case 'Proposal Sent':
                return 'bg-orange-100/20 text-orange-100 ring-1 ring-orange-500/30';
            case 'Negotiation':
                return 'bg-amber-100/20 text-amber-100 ring-1 ring-amber-500/30';
            case 'Closed Won':
                return 'bg-emerald-100/20 text-emerald-100 ring-1 ring-emerald-500/30';
            case 'Closed Lost':
                return 'bg-red-100/20 text-red-100 ring-1 ring-red-500/30';
            default:
                return 'bg-white/20';
        }
    };

    return (
        <>
            <style>{scrollbarHideStyles}</style>
            <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex overflow-hidden">
                    {/* Left Panel */}
                    <div className={`w-1/3 bg-gradient-to-b ${tenantColors.gradientFrom} ${tenantColors.gradientTo} p-8 text-white flex flex-col`}>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-4">Filter Leads</h2>
                            <p className="text-white/90 text-lg">Refine your leads list to find exactly what you're looking for.</p>
                        </div>

                        <div className="flex-grow space-y-6">
                            {/* Active Filters Summary */}
                            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                <h3 className="text-sm font-medium text-blue-100 mb-3">Active Filters</h3>
                                <div className="space-y-3">
                                    <p className="text-lg font-semibold">
                                        {getActiveFilterCount()} {getActiveFilterCount() === 1 ? 'Filter' : 'Filters'} Applied
                                    </p>
                                    <div className="space-y-2">
                                        {filters.search && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className={`px-3 py-1 rounded-full ${filters.leadStatus ? getStatusColor(filters.leadStatus) : 'bg-white/20'}`}>
                                                    Search: {filters.search}
                                                </span>
                                            </div>
                                        )}
                                        {filters.leadStatus && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className={`px-3 py-1 rounded-full ${getStatusColor(filters.leadStatus)}`}>
                                                    Status: {filters.leadStatus}
                                                </span>
                                            </div>
                                        )}
                                        {filters.leadType && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="bg-white/20 px-3 py-1 rounded-full">
                                                    Type: {filters.leadType}
                                                </span>
                                            </div>
                                        )}
                                        {filters.leadProgress && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className={`px-3 py-1 rounded-full ${getProgressColor(filters.leadProgress)}`}>
                                                    Progress: {filters.leadProgress}
                                                </span>
                                            </div>
                                        )}
                                        {filters.province && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="bg-white/20 px-3 py-1 rounded-full">
                                                    Province: {filters.province}
                                                </span>
                                            </div>
                                        )}
                                        {filters.city && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="bg-white/20 px-3 py-1 rounded-full">
                                                    City: {filters.city}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Tips */}
                            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                <h3 className="text-sm font-medium text-blue-100 mb-3">Quick Tips</h3>
                                <ul className="space-y-2 text-sm text-blue-100">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Use search for name or email matching
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Reset filters to see all leads
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <div className="p-8">
                            <div className="flex justify-end">
                                <button
                                    onClick={handleClose}
                                    className="text-gray-400 hover:text-gray-500 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Search */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Search</h3>
                                    <div className={inputGroupClasses}>
                                        <input
                                            type="text"
                                            name="search"
                                            value={filters.search || ''}
                                            onChange={handleChange}
                                            className={`${inputClasses} ${filters.search ? 'input-filled' : ''}`}
                                        />
                                        <label className={labelClasses}>Search by name or email</label>
                                    </div>
                                </div>

                                {/* Lead Status and Type */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Classification</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className={inputGroupClasses}>
                                            <select
                                                name="leadStatus"
                                                value={filters.leadStatus || ''}
                                                onChange={handleChange}
                                                className={inputClasses}
                                            >
                                                <option value="">All Statuses</option>
                                                <option value="Open">Open</option>
                                                <option value="Converted">Converted</option>
                                                <option value="Rejected">Rejected</option>
                                                <option value="Discarded">Discarded</option>
                                            </select>
                                            <label className={labelClasses}>Lead Status</label>
                                        </div>
                                        <div className={inputGroupClasses}>
                                            <select
                                                name="leadType"
                                                value={filters.leadType || ''}
                                                onChange={handleChange}
                                                className={inputClasses}
                                            >
                                                <option value="">All Types</option>
                                                <option value="Support">Support</option>
                                                <option value="Sales">Sales</option>
                                                <option value="Consultation">Consultation</option>
                                            </select>
                                            <label className={labelClasses}>Lead Type</label>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
                                    <div className={inputGroupClasses}>
                                        <select
                                            name="leadProgress"
                                            value={filters.leadProgress || ''}
                                            onChange={handleChange}
                                            className={inputClasses}
                                        >
                                            <option value="">All Progress</option>
                                            <option value="New Lead Entry">New Lead Entry</option>
                                            <option value="Initial Contact">Initial Contact</option>
                                            <option value="Follow Up">Follow Up</option>
                                            <option value="Negotiation">Negotiation</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                        <label className={labelClasses}>Lead Progress</label>
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className={inputGroupClasses}>
                                            <input
                                                type="text"
                                                name="province"
                                                value={filters.province || ''}
                                                onChange={handleChange}
                                                className={`${inputClasses} ${filters.province ? 'input-filled' : ''}`}
                                            />
                                            <label className={labelClasses}>Province</label>
                                        </div>
                                        <div className={inputGroupClasses}>
                                            <input
                                                type="text"
                                                name="city"
                                                value={filters.city || ''}
                                                onChange={handleChange}
                                                className={`${inputClasses} ${filters.city ? 'input-filled' : ''}`}
                                            />
                                            <label className={labelClasses}>City</label>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-6">
                                    <Button
                                        variant="secondary"
                                        onClick={handleReset}
                                        type="button"
                                    >
                                        Reset Filters
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={onClose}
                                        type="button"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                    >
                                        Apply Filters
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};