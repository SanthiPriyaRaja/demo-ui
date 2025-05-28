import React from 'react';
import { TenantProvider, useTenant } from './contexts/TenantContext';

const MainContent: React.FC = () => {
  const { currentTenant } = useTenant();

  if (!currentTenant) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header 
        className="bg-white shadow-md"
        style={{ backgroundColor: currentTenant.theme.primary }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={currentTenant.logo} 
                alt={`${currentTenant.name} logo`} 
                className="h-8 w-auto"
              />
              <h1 className="ml-4 text-white text-xl font-semibold">
                {currentTenant.name}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
          <p className="text-gray-600">
            This is a multi-tenant application. You are currently viewing the dashboard for {currentTenant.name}.
          </p>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <TenantProvider>
      <MainContent />
    </TenantProvider>
  );
}

export default App;
