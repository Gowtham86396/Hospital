import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import LabTests from './pages/LabTests';
import Procedures from './pages/Procedures';
import Surgeries from './pages/Surgeries';
import Bills from './pages/Bills';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <Patients />;
      case 'lab-tests':
        return <LabTests />;
      case 'procedures':
        return <Procedures />;
      case 'surgeries':
        return <Surgeries />;
      case 'bills':
        return <Bills />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="ml-64 p-8">
          {renderContent()}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;