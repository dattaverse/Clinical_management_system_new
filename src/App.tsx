import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/Auth/AuthForm';
import LandingPage from './components/Landing/LandingPage';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import PatientList from './components/Patients/PatientList';
import DatabaseStatus from './components/Database/DatabaseStatus';
import ClinicList from './components/Clinics/ClinicList';
import AppointmentList from './components/Appointments/AppointmentList';
import PrescriptionList from './components/Prescriptions/PrescriptionList';
import VoiceAgentList from './components/VoiceAgent/VoiceAgentList';
import { ClinicProvider } from './contexts/ClinicContext';
import ComplianceManagement from './components/Admin/ComplianceManagement';
import SystemSettings from './components/Admin/SystemSettings';
import AnalyticsPage from './components/Analytics/AnalyticsPage';

// Placeholder components for other tabs
const Placeholder: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-6">
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600">This section is being built. Full functionality will be available soon.</p>
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Coming Soon</h3>
        <p className="text-blue-700 text-sm">
          This feature will include comprehensive {title.toLowerCase()} management with AI-powered insights and automation.
        </p>
      </div>
    </div>
  </div>
);

const App: React.FC = React.memo(() => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuth, setShowAuth] = useState<'signin' | 'signup' | null>(null);
  const [initComplete, setInitComplete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Reset to landing page when user logs out
  React.useEffect(() => {
    if (!user && initComplete && !loading) {
      console.log('User logged out, resetting to landing page');
      setShowAuth(null);
      setActiveTab('dashboard');
    }
    
    // Mark initialization as complete when loading is done
    if (!loading && !initComplete) {
      setInitComplete(true);
    }
  }, [user, loading, initComplete]);

  // Show loading only if we haven't completed initial auth check
  if (loading || !initComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading HealthSphere...</p>
        </div>
      </div>
    );
  }

  // Debug logging to help identify issues
  // console.log('App render state:', { 
  //   user: !!user, 
  //   loading, 
  //   showAuth, 
  //   activeTab,
  //   userEmail: user?.email
  // });

  if (!user) {
    if (showAuth) {
      return <AuthForm initialMode={showAuth} onBack={() => setShowAuth(null)} />;
    }
    return <LandingPage onShowAuth={setShowAuth} />;
  }


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'clinics':
        return <ClinicList />;
      case 'patients':
        return <PatientList />;
      case 'database-status':
        return <DatabaseStatus />;
      case 'appointments':
        return <AppointmentList />;
      case 'prescriptions':
        return <PrescriptionList />;
      case 'communication':
        return <Placeholder title="Patient Communication" />;
      case 'marketing':
        return <Placeholder title="AI Marketing" />;
      case 'voice-agent':
        return <VoiceAgentList />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'compliance':
        return <ComplianceManagement />;
      case 'settings':
        return <SystemSettings />;
      case 'billing':
        return <Placeholder title="Billing & Subscriptions" />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <ClinicProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main className="flex-1 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </ClinicProvider>
  );
});

App.displayName = 'App';

export default App;