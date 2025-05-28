/**
 * Get the API URL from environment variables
 * @returns The API URL
 */
export const getApiUrl = (): string => {
  if (process.env.NODE_ENV === 'test') {
    return process.env.VITE_API_URL || 'http://localhost:3000';
  }
  
  // For development and production
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }

  return 'http://localhost:3000';
}; 