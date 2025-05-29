import React, { useState, useEffect } from 'react';
import { useTenant } from '../features/tenant/TenantContext';
import { getTenantColors } from '../utils/tenantTheme';
import type { Lead } from '../types/Lead';
import { Button } from './ui/Button';

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
textarea:focus + .floating-label,
select:focus + .floating-label {
    transform: translateY(-1.5rem) scale(0.85);
    color: #3b82f6;
}

.input-group:focus-within .floating-label {
    color: #3b82f6;
}
`;

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
    const labelClasses = "floating-label";

    return (
        <>
            <style>{scrollbarHideStyles}</style>
            <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex overflow-hidden">
                    {/* Left Panel - Preview/Summary */}
                    <div className={`w-1/3 bg-gradient-to-br ${tenantColors.gradientFrom} ${tenantColors.gradientTo} p-8 flex flex-col items-center text-center relative overflow-hidden`}>
                        {/* Glossy overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-70 pointer-events-none" />
                        
                        <div className="flex-1 relative" />
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 rotate-3 transform hover:rotate-0 transition-transform duration-300 relative">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                        <div className="space-y-4 relative">
                            <h2 className="text-3xl font-bold text-white">Update Lead</h2>
                            <p className="text-white/90">Modify lead information and track their progress</p>
                        </div>
                        <div className="flex-1 relative" />
                        <div className="w-full pt-8 border-t border-white/10 relative">
                            <p className="text-sm text-white/70">Keep your lead information up to date</p>
                        </div>
                    </div>

                    {/* Right Form Section */}
                    <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={inputGroupClasses}>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName || ''}
                                            onChange={handleChange}
                                            className={`${inputClasses} ${formData.firstName ? 'input-filled' : ''}`}
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
                                            className={`${inputClasses} ${formData.lastName ? 'input-filled' : ''}`}
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
                                            className={`${inputClasses} ${formData.email ? 'input-filled' : ''}`}
                                            required
                                        />
                                        <label className={labelClasses}>Email</label>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className={`${inputGroupClasses} ${errors.mobileNo ? 'border-red-500 ring-4 ring-red-500/10' : ''}`}>
                                        <input
                                            type="tel"
                                            name="mobileNo"
                                            value={formData.mobileNo || ''}
                                            onChange={handleChange}
                                            className={`${inputClasses} ${formData.mobileNo ? 'input-filled' : ''}`}
                                            required
                                            maxLength={10}
                                            pattern="[0-9]{10}"
                                        />
                                        <label className={labelClasses}>Mobile Number (10 digits)</label>
                                        {errors.mobileNo && (
                                            <div className="absolute -bottom-6 left-0 text-sm text-red-500">
                                                {errors.mobileNo}
                                            </div>
                                        )}
                                    </div>

                                    <div className={inputGroupClasses}>
                                        <input
                                            type="tel"
                                            name="landlineNo"
                                            value={formData.landlineNo || ''}
                                            onChange={handleChange}
                                            className={`${inputClasses} ${formData.landlineNo ? 'input-filled' : ''}`}
                                        />
                                        <label className={labelClasses}>Landline (Optional)</label>
                                    </div>

                                    <div className={inputGroupClasses}>
                                        <input
                                            type="text"
                                            name="province"
                                            value={formData.province || ''}
                                            onChange={handleChange}
                                            className={`${inputClasses} ${formData.province ? 'input-filled' : ''}`}
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
                                            className={`${inputClasses} ${formData.city ? 'input-filled' : ''}`}
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
                                            className={`${inputClasses} ${formData.leadType ? 'input-filled' : ''}`}
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
                                            className={`${inputClasses} ${formData.leadStatus ? 'input-filled' : ''}`}
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
                                            className={`${inputClasses} ${formData.leadProgress ? 'input-filled' : ''}`}
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
                                            className={`${inputClasses} ${formData.appointmentDate ? 'input-filled' : ''}`}
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
                                            className={`${inputClasses} resize-none h-24 ${formData.allocatorRemarks ? 'input-filled' : ''}`}
                                        />
                                        <label className={labelClasses}>Allocator Remarks (Optional)</label>
                                    </div>

                                    <div className={inputGroupClasses}>
                                        <textarea
                                            name="userRemarks"
                                            value={formData.userRemarks || ''}
                                            onChange={handleChange}
                                            className={`${inputClasses} resize-none h-24 ${formData.userRemarks ? 'input-filled' : ''}`}
                                        />
                                        <label className={labelClasses}>User Remarks (Optional)</label>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`${tenantColors.buttonPrimary} ${tenantColors.buttonHover} transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl`}
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Lead'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}; 