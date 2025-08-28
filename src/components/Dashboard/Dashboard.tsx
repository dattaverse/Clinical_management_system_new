import React from 'react';
import { Building2 } from 'lucide-react';
import DashboardStats from './DashboardStats';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import UpcomingAppointments from './UpcomingAppointments';
import AIInsights from './AIInsights';
import { useAuth } from '../../hooks/useAuth';
import { useClinicContext } from '../../contexts/ClinicContext';
import AdminDashboard from '../Admin/AdminDashboardSimple';
import CreateClinicModal from '../Clinics/CreateClinicModal';

interface DashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activeTab, setActiveTab }) => {
  const { isAdmin, admin, doctor } = useAuth();
  const { selectedClinic, setSelectedClinic, clinics, loading, refreshClinics } = useClinicContext();
  const [showCreateClinicModal, setShowCreateClinicModal] = React.useState(false);

  // If user is admin, show admin dashboard
  if (isAdmin) {
    return <AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
  }

  // Handle case where no doctor data is available
  if (!doctor) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            
            {/* Clinic Selector */}
            {doctor && (
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                <Building2 className="w-5 h-5 text-blue-600" />
                <select
                  value={selectedClinic || 'all'}
                  onChange={(e) => {
                    if (e.target.value === 'create-new') {
                      setShowCreateClinicModal(true);
                      return;
                    }
                    setSelectedClinic(e.target.value === 'all' ? null : e.target.value);
                  }}
                  disabled={loading}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-gray-700 cursor-pointer pr-6 appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1rem' }}
                >
                  <option value="all">All Clinics</option>
                  {clinics.map(clinic => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </option>
                  ))}
                  <option value="create-new" className="font-medium text-blue-600">
                    + Create New Clinic
                  </option>
                </select>
              </div>
            )}
          </div>
          
          <p className="text-gray-600">
            Welcome back, {doctor?.name || 'Doctor'}. {
            selectedClinic && selectedClinic !== 'all'
              ? `Here's what's happening at ${clinics.find(c => c.id === selectedClinic)?.name || 'your clinic'} today.`
              : "Here's what's happening across all your clinics today."
            }
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Today</div>
          <div className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions setActiveTab={setActiveTab} />
        <AIInsights />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingAppointments />
        <RecentActivity />
      </div>
      
      {/* Create Clinic Modal */}
      <CreateClinicModal
        isOpen={showCreateClinicModal}
        onClose={() => setShowCreateClinicModal(false)}
        onClinicCreated={() => {
          refreshClinics();
        }}
      />
    </div>
  );
};

export default Dashboard;