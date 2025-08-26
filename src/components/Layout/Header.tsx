import React, { useState } from 'react';
import { Bell, Search, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { doctor, admin, isAdmin, signOut } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out...');
      await signOut();
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const currentUser = isAdmin ? admin : doctor;
  const userRole = isAdmin ? 'Super Admin' : 'Doctor';

  // Get the display name properly formatted
  const getDisplayName = () => {
    if (isAdmin && admin) {
      return admin.name;
    }
    if (doctor) {
      // For rghatwai@gmail.com, ensure correct name display
      if (doctor.email === 'rghatwai@gmail.com') {
        return 'Dr. Rahul Ghatwai';
      }
      return doctor.name || 'Doctor';
    }
    return 'User';
  };
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Burger Menu + Search */}
          <div className="flex items-center space-x-6">
            {/* Mobile Burger Menu */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Search - Desktop */}
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patients, appointments..."
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 lg:w-80 bg-gray-50 hover:bg-white transition-colors"
              />
            </div>

            {/* Search - Mobile Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Right Section - Status, Notifications, User */}
          <div className="flex items-center space-x-4">
            {/* Plan & Usage */}
            <div className="hidden sm:flex items-center space-x-3">
              {/* AI Agent Status - moved here for better positioning */}
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-800">AI Active</span>
              </div>
              
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                isAdmin 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {isAdmin ? 'Super Admin' : 'Pro Plan'}
              </div>
              {!isAdmin && (
                <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  120/500 AI mins
                </div>
              )}
            </div>
            
            {/* Notifications */}
            <button className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-semibold text-gray-900">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
              <div className={`w-10 h-10 ${isAdmin ? 'bg-red-100' : 'bg-blue-100'} rounded-xl flex items-center justify-center shadow-sm`}>
                <User className={`w-5 h-5 ${isAdmin ? 'text-red-600' : 'text-blue-600'}`} />
              </div>
              <button
                onClick={handleSignOut}
                className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="mt-4 md:hidden">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patients, appointments..."
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full bg-gray-50 hover:bg-white transition-colors"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Clinic Selector */}
      </div>

    </header>
  );
};

export default Header;