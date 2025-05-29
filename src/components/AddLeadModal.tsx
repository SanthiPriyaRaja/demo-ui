import React, { useState } from 'react';
import { Button } from './ui/Button';
import type { Lead } from '../types/Lead';
import { useTenant } from '../features/tenant/TenantContext';
import { getTenantColors } from '../utils/colors';

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

interface AddLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (lead: Partial<Lead>) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const { currentTenant } = useTenant();
    const tenantColors = getTenantColors(currentTenant);
    
    const initialFormState: Partial<Lead> = {
        firstName: '',
        lastName: '',
        email: '',
        mobileNo: '',
        landlineNo: '',
        province: '',
        city: '',
        leadType: 'Support',
        leadStatus: 'Open',
        leadProgress: 'New Lead Entry',
        allocatorRemarks: '',
        userRemarks: '',
        appointmentDate: new Date().toISOString().split('T')[0]
    };

    const [formData, setFormData] = useState<Partial<Lead>>(initialFormState);
    const [errors, setErrors] = useState<Record<string, string>>({});

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate mobile number
        if (!validateMobileNumber(formData.mobileNo || '')) {
            setErrors(prev => ({ 
                ...prev, 
                mobileNo: 'Mobile number must be exactly 10 digits' 
            }));
            return;
        }

        onSubmit(formData);
        setFormData(initialFormState);
        setErrors({});
        onClose();
    };

    const handleClose = () => {
        setFormData(initialFormState);
        onClose();
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
                    <div className={`w-1/3 bg-gradient-to-b ${tenantColors.gradientFrom} ${tenantColors.gradientTo} p-8 text-white flex flex-col`}>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-4">New Lead</h2>
                            <p className="text-white/90 text-lg">Add a new lead to your pipeline and start tracking their journey.</p>
                        </div>

                        {/* Preview Section */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                            <div className="space-y-6">
                                {/* Basic Info Preview */}
                                {(formData.firstName || formData.lastName) && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-white/90 mb-2">Contact Information</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                                    <span className="text-lg font-semibold text-white">
                                                        {formData.firstName?.[0] || ''}{formData.lastName?.[0] || ''}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {formData.firstName} {formData.lastName}
                                                    </p>
                                                    {formData.email && (
                                                        <p className="text-sm text-white/70">{formData.email}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {formData.mobileNo && (
                                                <div className="flex items-center gap-2 text-white/70">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span>{formData.mobileNo}</span>
                                                </div>
                                            )}
                                            {(formData.city || formData.province) && (
                                                <div className="flex items-center gap-2 text-white/70">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>
                                                        {[formData.city, formData.province].filter(Boolean).join(', ')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Lead Details Preview */}
                                {(formData.leadType || formData.leadStatus || formData.leadProgress) && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-white/90 mb-2">Lead Details</h3>
                                        <div className="space-y-2">
                                            {formData.leadType && (
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10">
                                                        Type: {formData.leadType}
                                                    </span>
                                                </div>
                                            )}
                                            {formData.leadStatus && (
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10">
                                                        Status: {formData.leadStatus}
                                                    </span>
                                                </div>
                                            )}
                                            {formData.leadProgress && (
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10">
                                                        Progress: {formData.leadProgress}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Remarks Preview */}
                                {(formData.allocatorRemarks || formData.userRemarks) && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-white/90 mb-2">Remarks</h3>
                                        <div className="space-y-2">
                                            {formData.allocatorRemarks && (
                                                <div>
                                                    <p className="text-sm text-white/70">Allocator Remarks:</p>
                                                    <p className="text-sm text-white/90">{formData.allocatorRemarks}</p>
                                                </div>
                                            )}
                                            {formData.userRemarks && (
                                                <div>
                                                    <p className="text-sm text-white/70">User Remarks:</p>
                                                    <p className="text-sm text-white/90">{formData.userRemarks}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
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
                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={inputGroupClasses}>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={`${inputClasses} ${formData.firstName ? 'input-filled' : ''}`}
                                            required
                                        />
                                        <label className={labelClasses}>First Name</label>
                                    </div>
                                    <div className={inputGroupClasses}>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={`${inputClasses} ${formData.lastName ? 'input-filled' : ''}`}
                                            required
                                        />
                                        <label className={labelClasses}>Last Name</label>
                                    </div>
                                    <div className={inputGroupClasses}>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`${inputClasses} ${formData.email ? 'input-filled' : ''}`}
                                            required
                                        />
                                        <label className={labelClasses}>Email</label>
                                    </div>
                                    <div className={`${inputGroupClasses} ${errors.mobileNo ? 'border-red-500 ring-4 ring-red-500/10' : ''}`}>
                                        <input
                                            type="tel"
                                            name="mobileNo"
                                            value={formData.mobileNo}
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
                                            value={formData.landlineNo}
                                            onChange={handleChange}
                                            className={`${inputClasses} ${formData.landlineNo ? 'input-filled' : ''}`}
                                        />
                                        <label className={labelClasses}>Landline (Optional)</label>
                                    </div>
                                    <div className={inputGroupClasses}>
                                        <input
                                            type="text"
                                            name="province"
                                            value={formData.province}
                                            onChange={handleChange}
                                            className={`${inputClasses} ${formData.province ? 'input-filled' : ''}`}
                                            required
                                        />
                                        <label className={labelClasses}>Province</label>
                                    </div>
                                    <div className={inputGroupClasses}>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={`${inputClasses} ${formData.city ? 'input-filled' : ''}`}
                                            required
                                        />
                                        <label className={labelClasses}>City</label>
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
                                            value={formData.leadType}
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
                                            value={formData.leadStatus}
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
                                            value={formData.leadProgress}
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
                                            value={formData.appointmentDate}
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
                                            value={formData.allocatorRemarks}
                                            onChange={handleChange}
                                            className={`${inputClasses} resize-none h-24 ${formData.allocatorRemarks ? 'input-filled' : ''}`}
                                        />
                                        <label className={labelClasses}>Allocator Remarks (Optional)</label>
                                    </div>
                                    <div className={inputGroupClasses}>
                                        <textarea
                                            name="userRemarks"
                                            value={formData.userRemarks}
                                            onChange={handleChange}
                                            className={`${inputClasses} resize-none h-24 ${formData.userRemarks ? 'input-filled' : ''}`}
                                        />
                                        <label className={labelClasses}>User Remarks (Optional)</label>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                >
                                    Add Lead
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};