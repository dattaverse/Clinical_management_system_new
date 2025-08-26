import React from 'react';
import { 
  Home, 
  Building2, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Megaphone,
  Settings,
  CreditCard,
  Shield,
  BarChart3,
  Phone,
  Bot,
  Database
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'clinics', label: 'Clinics', icon: Building2 },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    ...(isAdmin ? [
      { id: 'voice-agent', label: 'Voice Agent', icon: Phone },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'database-status', label: 'Database Status', icon: Database },
      { id: 'compliance', label: 'Compliance', icon: Shield },
      { id: 'settings', label: 'Settings', icon: Settings },
    ] : []),
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">HealthSphere</h1>
            <p className="text-xs text-gray-500">AI-First CMS</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose(); // Close sidebar on mobile after selection
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

    </div>
    </>
  );
};

export default Sidebar;