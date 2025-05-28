import React from 'react';
import type { Lead } from '../types/Lead';

interface LeadCardProps {
    lead: Lead;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open':
                return 'bg-blue-100 text-blue-800';
            case 'Converted':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            case 'Discarded':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200
            shadow-[0_2px_4px_rgba(0,0,0,0.02),0_4px_16px_rgba(0,0,0,0.06)] 
            hover:shadow-[0_8px_16px_rgba(0,0,0,0.08),0_16px_32px_rgba(0,0,0,0.06)] 
            transition-all duration-300 transform hover:scale-[1.02]">
            <div className="px-6 py-4">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {lead.firstName} {lead.lastName}
                        </h3>
                        <div className="mt-0.5 space-y-0.5">
                            <p className="text-sm text-gray-600">{lead.email}</p>
                            <p className="text-sm text-gray-600">
                                {lead.city}, {lead.province}
                            </p>
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(lead.leadStatus)}`}>
                        {lead.leadStatus}
                    </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                        <p className="text-xs font-medium text-gray-500">Lead Type</p>
                        <p className="text-sm text-gray-900">{lead.leadType}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500">Progress</p>
                        <p className="text-sm text-gray-900">{lead.leadProgress}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500">Contact</p>
                        <p className="text-sm text-gray-900">{lead.mobileNo}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500">Appointment</p>
                        <p className="text-sm text-gray-900">{formatDate(lead.appointmentDate)}</p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500">Created</p>
                    <p className="text-sm text-gray-900">{formatDate(lead.createdAt)}</p>
                    <p className="text-xs font-medium text-gray-500 mt-2">Remarks</p>
                    <p className="text-sm text-gray-900 mt-1 line-clamp-2">{lead.userRemarks}</p>
                </div>
            </div>
        </div>
    );
};