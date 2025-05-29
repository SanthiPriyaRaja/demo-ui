/**
 * Format a date string to a human-readable format
 * @param dateString - The date string to format
 * @returns The formatted date string
 */
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}; 