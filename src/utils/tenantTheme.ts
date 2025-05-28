interface TenantColors {
  gradientFrom: string;
  gradientTo: string;
  buttonPrimary: string;
  buttonHover: string;
}

export const getTenantColors = (tenantId: string): TenantColors => {
  switch (tenantId) {
    case 'tenant1':
      return {
        gradientFrom: 'from-blue-600',
        gradientTo: 'to-indigo-600',
        buttonPrimary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
        buttonHover: 'hover:from-blue-700 hover:to-indigo-700',
      };
    case 'tenant2':
      return {
        gradientFrom: 'from-emerald-600',
        gradientTo: 'to-teal-600',
        buttonPrimary: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
        buttonHover: 'hover:from-emerald-700 hover:to-teal-700',
      };
    case 'tenant3':
      return {
        gradientFrom: 'from-purple-600',
        gradientTo: 'to-pink-600',
        buttonPrimary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
        buttonHover: 'hover:from-purple-700 hover:to-pink-700',
      };
    default:
      return {
        gradientFrom: 'from-blue-600',
        gradientTo: 'to-indigo-600',
        buttonPrimary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
        buttonHover: 'hover:from-blue-700 hover:to-indigo-700',
      };
  }
}; 