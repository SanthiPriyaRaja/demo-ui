import React, { useState } from 'react';
import { Button } from './ui/Button';

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

export const FilterLeadsModal: React.FC<FilterLeadsModalProps> = ({ 
    isOpen, 
    onClose, 
    onApplyFilters,
    initialFilters = {}
}) => {
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-2xl">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Filter Leads</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                name="search"
                                value={filters.search || ''}
                                onChange={handleChange}
                                placeholder="Search by name or email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lead Status</label>
                            <select
                                name="leadStatus"
                                value={filters.leadStatus || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Statuses</option>
                                <option value="Open">Open</option>
                                <option value="Converted">Converted</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Discarded">Discarded</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lead Type</label>
                            <select
                                name="leadType"
                                value={filters.leadType || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Types</option>
                                <option value="Support">Support</option>
                                <option value="Sales">Sales</option>
                                <option value="Consultation">Consultation</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lead Progress</label>
                            <select
                                name="leadProgress"
                                value={filters.leadProgress || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Progress</option>
                                <option value="New Lead Entry">New Lead Entry</option>
                                <option value="Initial Contact">Initial Contact</option>
                                <option value="Follow Up">Follow Up</option>
                                <option value="Negotiation">Negotiation</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                            <input
                                type="text"
                                name="province"
                                value={filters.province || ''}
                                onChange={handleChange}
                                placeholder="Filter by province"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                name="city"
                                value={filters.city || ''}
                                onChange={handleChange}
                                placeholder="Filter by city"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button variant="secondary" onClick={handleReset} type="button">
                            Reset Filters
                        </Button>
                        <Button variant="secondary" onClick={onClose} type="button">
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Apply Filters
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};