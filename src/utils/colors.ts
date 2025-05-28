import { useEffect, useState } from 'react';

export interface TenantColors {
    gradientFrom: string;
    gradientTo: string;
    headerFrom: string;
    headerTo: string;
    buttonPrimary: string;
    buttonSecondary: string;
    badge: string;
    text: {
        primary: string;
        secondary: string;
        muted: string;
    };
    background: {
        light: string;
        medium: string;
        dark: string;
    };
}

export const getTenantColors = (tenant: string): TenantColors => {
    switch (tenant) {
        case 'tenant1':
            return {
                gradientFrom: 'from-blue-600',
                gradientTo: 'to-indigo-600',
                headerFrom: 'from-blue-500',
                headerTo: 'to-indigo-500',
                buttonPrimary: 'bg-blue-600 hover:bg-blue-700',
                buttonSecondary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
                badge: 'bg-blue-100 text-blue-800',
                text: {
                    primary: 'text-blue-900',
                    secondary: 'text-blue-600',
                    muted: 'text-blue-500',
                },
                background: {
                    light: 'bg-blue-50',
                    medium: 'bg-blue-100',
                    dark: 'bg-blue-200',
                }
            };
        case 'tenant2':
            return {
                gradientFrom: 'from-emerald-600',
                gradientTo: 'to-teal-600',
                headerFrom: 'from-emerald-500',
                headerTo: 'to-teal-500',
                buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700',
                buttonSecondary: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
                badge: 'bg-emerald-100 text-emerald-800',
                text: {
                    primary: 'text-emerald-900',
                    secondary: 'text-emerald-600',
                    muted: 'text-emerald-500',
                },
                background: {
                    light: 'bg-emerald-50',
                    medium: 'bg-emerald-100',
                    dark: 'bg-emerald-200',
                }
            };
        case 'tenant3':
            return {
                gradientFrom: 'from-purple-600',
                gradientTo: 'to-pink-600',
                headerFrom: 'from-purple-500',
                headerTo: 'to-pink-500',
                buttonPrimary: 'bg-purple-600 hover:bg-purple-700',
                buttonSecondary: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
                badge: 'bg-purple-100 text-purple-800',
                text: {
                    primary: 'text-purple-900',
                    secondary: 'text-purple-600',
                    muted: 'text-purple-500',
                },
                background: {
                    light: 'bg-purple-50',
                    medium: 'bg-purple-100',
                    dark: 'bg-purple-200',
                }
            };
        default:
            return {
                gradientFrom: 'from-blue-600',
                gradientTo: 'to-indigo-600',
                headerFrom: 'from-blue-500',
                headerTo: 'to-indigo-500',
                buttonPrimary: 'bg-blue-600 hover:bg-blue-700',
                buttonSecondary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
                badge: 'bg-blue-100 text-blue-800',
                text: {
                    primary: 'text-blue-900',
                    secondary: 'text-blue-600',
                    muted: 'text-blue-500',
                },
                background: {
                    light: 'bg-blue-50',
                    medium: 'bg-blue-100',
                    dark: 'bg-blue-200',
                }
            };
    }
}; 