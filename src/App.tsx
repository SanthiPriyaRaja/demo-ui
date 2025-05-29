import React from 'react';
import { AppRouter } from './routes/AppRouter';
import { ToastProvider } from './features/toast/ToastContext';

function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
}

export default App;
