import React from 'react';
import type { Lead } from '../types/Lead';
import { useTenantTheme } from '../features/theme/TenantThemeContext';

interface LeadCardProps {
    lead: Lead;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
    const { colors } = useTenantTheme();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open':
                return 'bg-blue-100 text-blue-800 ring-blue-600/20';
            case 'Converted':
                return 'bg-emerald-100 text-emerald-800 ring-emerald-600/20';
            case 'Rejected':
                return 'bg-red-100 text-red-800 ring-red-600/20';
            case 'Discarded':
                return 'bg-gray-100 text-gray-800 ring-gray-600/20';
            default:
                return 'bg-gray-100 text-gray-800 ring-gray-600/20';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getProgressColor = (progress: string) => {
        switch (progress) {
            case 'New Lead Entry':
                return colors.text.primary;
            case 'Contacted':
                return colors.text.primary;
            case 'Qualified':
                return colors.text.primary;
            case 'Proposal Sent':
                return colors.text.secondary;
            case 'Negotiation':
                return colors.text.secondary;
            case 'Closed Won':
                return colors.text.primary;
            case 'Closed Lost':
                return colors.text.secondary;
            default:
                return colors.text.muted;
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden
            shadow-[0_2px_4px_rgba(0,0,0,0.02),0_4px_16px_rgba(0,0,0,0.06)] 
            hover:shadow-[0_8px_16px_rgba(0,0,0,0.08),0_16px_32px_rgba(0,0,0,0.06)] 
            transition-all duration-300 transform hover:scale-[1.02]">
            
            {/* Card Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientTo} flex items-center justify-center border border-white/20`}>
                            <span className={`text-lg font-semibold text-white`}>
                                {lead.firstName[0]}{lead.lastName[0]}
                            </span>
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold ${colors.text.primary} mb-1`}>
                                {lead.firstName} {lead.lastName}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className={`text-sm ${colors.text.muted}`}>{lead.email}</span>
                            </div>
                        </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusColor(lead.leadStatus)}`}>
                        {lead.leadStatus}
                    </span>
                </div>
            </div>

            {/* Card Content */}
            <div className="px-6 py-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                            <svg className={`w-4 h-4 ${colors.text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className={`text-sm ${colors.text.secondary}`}>
                                {lead.city}, {lead.province}
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <svg className={`w-4 h-4 ${colors.text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <p className={`text-sm ${colors.text.secondary}`}>{lead.mobileNo}</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                            <svg className={`w-4 h-4 ${colors.text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className={`text-sm ${colors.text.secondary}`}>{lead.leadType}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <svg className={`w-4 h-4 ${colors.text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className={`text-sm ${colors.text.secondary}`}>{formatDate(lead.appointmentDate)}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                            <svg className={`w-4 h-4 ${colors.text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className={`text-sm font-medium ${getProgressColor(lead.leadProgress)}`}>
                                {lead.leadProgress}
                            </span>
                        </div>
                        <span className={`text-xs ${colors.text.muted}`}>
                            {lead.createdAt && `Created ${formatDate(lead.createdAt)}`}
                        </span>
                    </div>
                    {lead.userRemarks && lead.userRemarks.length > 0 && (
                        <div className="mt-2 bg-gray-50 rounded-xl p-3">
                            <p className={`text-xs font-medium ${colors.text.muted} mb-1`}>Remarks</p>
                            <p className={`text-sm ${colors.text.secondary} line-clamp-2`}>{lead.userRemarks}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};