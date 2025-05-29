import React, { useState, useEffect } from 'react';
import { useTenant } from '../features/tenant/TenantContext';
import { getTenantColors } from '../utils/tenantTheme';
import type { Lead } from '../types/Lead';
import { Button } from './ui/Button';

interface UpdateLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (leadId: string, data: Partial<Lead>) => Promise<void>;
    lead: Lead;
}

export const UpdateLeadModal: React.FC<UpdateLeadModalProps> = ({ isOpen, onClose, onSubmit, lead }) => {
    const { currentTenant } = useTenant();
    const tenantColors = getTenantColors(currentTenant);
    
    const [formData, setFormData] = useState<Partial<Lead>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with lead data when modal opens
    useEffect(() => {
        if (isOpen && lead) {
            setFormData({
                firstName: lead.firstName,
                lastName: lead.lastName,
                email: lead.email,
                mobileNo: lead.mobileNo,
                landlineNo: lead.landlineNo,
                province: lead.province,
                city: lead.city,
                leadType: lead.leadType,
                leadStatus: lead.leadStatus,
                leadProgress: lead.leadProgress,
                allocatorRemarks: lead.allocatorRemarks,
                userRemarks: lead.userRemarks,
                appointmentDate: lead.appointmentDate?.split('T')[0]
            });
            setErrors({});
        }
    }, [isOpen, lead]);

    const validateMobileNumber = (number: string) => {
        const mobileRegex = /^\d{10}$/;
        return mobileRegex.test(number);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Clear error when user starts typing
        setErrors(prev => ({ ...prev, [name]: '' }));

        if (name === 'mobileNo') {
            // Only allow digits
            const numbersOnly = value.replace(/\D/g, '');
            // Limit to 10 digits
            const truncated = numbersOnly.slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: truncated }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName?.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName?.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.mobileNo) {
            newErrors.mobileNo = 'Mobile number is required';
        } else if (!validateMobileNumber(formData.mobileNo)) {
            newErrors.mobileNo = 'Mobile number must be exactly 10 digits';
        }

        if (!formData.province?.trim()) {
            newErrors.province = 'Province is required';
        }

        if (!formData.city?.trim()) {
            newErrors.city = 'City is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit(lead._id!, formData);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const inputGroupClasses = "relative border-2 border-gray-300 rounded-xl bg-white transition-all duration-200 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10";
    const inputClasses = "w-full px-4 pt-6 pb-2 rounded-xl bg-transparent focus:outline-none text-gray-900 text-base";
    const labelClasses = "absolute top-2 left-4 text-xs font-medium text-gray-500 transition-all duration-200";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Update Lead</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={inputGroupClasses}>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName || ''}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        required
                                    />
                                    <label className={labelClasses}>First Name</label>
                                    {errors.firstName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                                    )}
                                </div>

                                <div className={inputGroupClasses}>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName || ''}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        required
                                    />
                                    <label className={labelClasses}>Last Name</label>
                                    {errors.lastName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                                    )}
                                </div>

                                <div className={inputGroupClasses}>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        required
                                    />
                                    <label className={labelClasses}>Email</label>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div className={inputGroupClasses}>
                                    <input
                                        type="tel"
                                        name="mobileNo"
                                        value={formData.mobileNo || ''}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        required
                                        maxLength={10}
                                        pattern="[0-9]{10}"
                                    />
                                    <label className={labelClasses}>Mobile Number (10 digits)</label>
                                    {errors.mobileNo && (
                                        <p className="mt-1 text-sm text-red-600">{errors.mobileNo}</p>
                                    )}
                                </div>

                                <div className={inputGroupClasses}>
                                    <input
                                        type="tel"
                                        name="landlineNo"
                                        value={formData.landlineNo || ''}
                                        onChange={handleChange}
                                        className={inputClasses}
                                    />
                                    <label className={labelClasses}>Landline (Optional)</label>
                                </div>

                                <div className={inputGroupClasses}>
                                    <input
                                        type="text"
                                        name="province"
                                        value={formData.province || ''}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        required
                                    />
                                    <label className={labelClasses}>Province</label>
                                    {errors.province && (
                                        <p className="mt-1 text-sm text-red-600">{errors.province}</p>
                                    )}
                                </div>

                                <div className={inputGroupClasses}>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city || ''}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        required
                                    />
                                    <label className={labelClasses}>City</label>
                                    {errors.city && (
                                        <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Lead Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={inputGroupClasses}>
                                    <select
                                        name="leadType"
                                        value={formData.leadType || ''}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        required
                                    >
                                        <option value="Support">Support</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Consultation">Consultation</option>
                                    </select>
                                    <label className={labelClasses}>Lead Type</label>
                                </div>

                                <div className={inputGroupClasses}>
                                    <select
                                        name="leadStatus"
                                        value={formData.leadStatus || ''}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        required
                                    >
                                        <option value="Open">Open</option>
                                        <option value="Converted">Converted</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Discarded">Discarded</option>
                                    </select>
                                    <label className={labelClasses}>Lead Status</label>
                                </div>

                                <div className={inputGroupClasses}>
                                    <select
                                        name="leadProgress"
                                        value={formData.leadProgress || ''}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        required
                                    >
                                        <option value="New Lead Entry">New Lead Entry</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Qualified">Qualified</option>
                                        <option value="Proposal Sent">Proposal Sent</option>
                                        <option value="Negotiation">Negotiation</option>
                                        <option value="Closed Won">Closed Won</option>
                                        <option value="Closed Lost">Closed Lost</option>
                                    </select>
                                    <label className={labelClasses}>Lead Progress</label>
                                </div>

                                <div className={inputGroupClasses}>
                                    <input
                                        type="date"
                                        name="appointmentDate"
                                        value={formData.appointmentDate || ''}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        required
                                    />
                                    <label className={labelClasses}>Appointment Date</label>
                                </div>
                            </div>
                        </div>

                        {/* Remarks */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Remarks</h3>
                            <div className="space-y-4">
                                <div className={inputGroupClasses}>
                                    <textarea
                                        name="allocatorRemarks"
                                        value={formData.allocatorRemarks || ''}
                                        onChange={handleChange}
                                        className={`${inputClasses} min-h-[100px]`}
                                        placeholder="Enter allocator remarks..."
                                    />
                                    <label className={labelClasses}>Allocator Remarks</label>
                                </div>

                                <div className={inputGroupClasses}>
                                    <textarea
                                        name="userRemarks"
                                        value={formData.userRemarks || ''}
                                        onChange={handleChange}
                                        className={`${inputClasses} min-h-[100px]`}
                                        placeholder="Enter user remarks..."
                                    />
                                    <label className={labelClasses}>User Remarks</label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <Button
                                type="button"
                                onClick={onClose}
                                variant="secondary"
                                className="px-6 py-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 ${tenantColors.buttonPrimary} ${tenantColors.buttonHover}`}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Lead'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}; 