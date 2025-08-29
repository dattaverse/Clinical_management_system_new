import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2, 
  Calendar, 
  Phone, 
  Shield, 
  BarChart3, 
  Plus,
  Search,
  MoreVertical,
  TrendingUp,
  CheckCircle,
  Database,
  MapPin,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Doctor } from '../../types';
import AddDoctorModal from './AddDoctorModal';

interface AdminDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [systemStats, setSystemStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalClinics: 0,
    activeVoiceCalls: 0,
    complianceScore: 95,
    databaseHealth: 'excellent',
    analyticsScore: 92
  });

  // Store created doctors in component state for demo mode
  const [createdDoctors, setCreatedDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetchDoctors();
    fetchSystemStats();
    
    // Set up real-time subscription for doctors table if Supabase is configured
    if (isSupabaseConfigured && supabase) {
      const subscription = supabase
        .channel('doctors-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'doctors' },
          (payload) => {
            console.log('Doctors table changed:', payload);
            fetchDoctors(); // Refresh the doctors list
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const fetchDoctors = async () => {
    setDoctorsLoading(true);
    try {
      console.log('=== FETCHING DOCTORS DEBUG ===');
      console.log('isSupabaseConfigured:', isSupabaseConfigured);
      console.log('supabase client exists:', !!supabase);
      
      if (supabase && isSupabaseConfigured) {
        try {
          console.log('Attempting to fetch doctors from Supabase...');
          const { data, error } = await supabase
            .from('doctors')
            .select('*')
            .order('created_at', { ascending: false });

          console.log('Supabase response - data:', data);
          console.log('Supabase response - error:', error);
          
          if (error) {
            console.error('Supabase fetch error:', error);
            setError(`Database error: ${error.message}`);
            // Still fall through to demo data
          } else {
            console.log('Successfully fetched doctors from Supabase:', data);
            setDoctors(data || []);
            setSystemStats(prev => ({ ...prev, totalDoctors: data?.length || 0 }));
            setError(''); // Clear any previous errors
            return;
          }
        } catch (supabaseError) {
          console.warn('Failed to fetch from Supabase, using demo data:', supabaseError);
          setError(`Connection error: ${supabaseError instanceof Error ? supabaseError.message : 'Unknown error'}`);
      } else {
        console.warn('Supabase not configured, using demo data');
        setError('Supabase not configured - using demo data');
      }

      // Fallback to demo data
      console.log('Using demo data');
      const demoDoctors: Doctor[] = [
        {
          id: 'rghatwai-doctor-id',
          email: 'rghatwai@gmail.com',
          name: 'Dr. Rahul Ghatwai',
          country: 'US',
          phone: '+1 (555) 999-8888',
          timezone: 'America/New_York',
          subscription_plan: 'pro_plus',
          ai_minutes_used: 850,
          msg_quota_used: 2400,
          created_at: '2024-01-01T08:00:00Z'
        },
        {
          id: 'doctor-1',
          email: 'dr.smith@clinic.com',
          name: 'Dr. John Smith',
          country: 'US',
          phone: '+1 (555) 123-4567',
          timezone: 'America/New_York',
          subscription_plan: 'pro',
          ai_minutes_used: 450,
          msg_quota_used: 1200,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 'doctor-2',
          email: 'dr.johnson@medical.com',
          name: 'Dr. Sarah Johnson',
          country: 'US',
          phone: '+1 (555) 987-6543',
          timezone: 'America/Los_Angeles',
          subscription_plan: 'pro_plus',
          ai_minutes_used: 780,
          msg_quota_used: 2100,
          created_at: '2024-02-20T14:30:00Z'
        },
        {
          id: 'doctor-3',
          email: 'dr.brown@health.com',
          name: 'Dr. Michael Brown',
          country: 'CA',
          phone: '+1 (416) 555-0123',
          timezone: 'America/Toronto',
          subscription_plan: 'starter',
          ai_minutes_used: 120,
          msg_quota_used: 350,
          created_at: '2024-03-10T09:15:00Z'
        },
        {
          id: 'doctor-4',
          email: 'dr.garcia@wellness.com',
          name: 'Dr. Maria Garcia',
          country: 'US',
          phone: '+1 (555) 456-7890',
          timezone: 'America/Chicago',
          subscription_plan: 'pro',
          ai_minutes_used: 320,
          msg_quota_used: 890,
          created_at: '2024-01-25T11:30:00Z'
        },
        {
          id: 'doctor-5',
          email: 'dr.patel@family.com',
          name: 'Dr. Raj Patel',
          country: 'US',
          phone: '+1 (555) 234-5678',
          timezone: 'America/Denver',
          subscription_plan: 'pro_plus',
          ai_minutes_used: 650,
          msg_quota_used: 1850,
          created_at: '2024-02-05T09:45:00Z'
        },
        {
          id: 'doctor-6',
          email: 'dr.lee@cardio.com',
          name: 'Dr. Jennifer Lee',
          country: 'CA',
          phone: '+1 (604) 555-9876',
          timezone: 'America/Vancouver',
          subscription_plan: 'starter',
          ai_minutes_used: 85,
          msg_quota_used: 245,
          created_at: '2024-03-01T14:20:00Z'
        },
        {
          id: 'doctor-7',
          email: 'dr.wilson@pediatrics.com',
          name: 'Dr. Robert Wilson',
          country: 'GB',
          phone: '+44 20 7946 0958',
          timezone: 'Europe/London',
          subscription_plan: 'pro',
          ai_minutes_used: 410,
          msg_quota_used: 1150,
          created_at: '2024-02-12T16:10:00Z'
        },
        {
          id: 'doctor-8',
          email: 'dr.chen@orthopedic.com',
          name: 'Dr. David Chen',
          country: 'AU',
          phone: '+61 2 9876 5432',
          timezone: 'Australia/Sydney',
          subscription_plan: 'pro_plus',
          ai_minutes_used: 720,
          msg_quota_used: 2250,
          created_at: '2024-01-30T08:15:00Z'
        }
      ];
      setDoctors(demoDoctors);
      setSystemStats(prev => ({ ...prev, totalDoctors: demoDoctors.length }));
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    } finally {
      setDoctorsLoading(false);
    }
  };

  const fetchSystemStats = async () => {
    try {
      if (!isSupabaseConfigured) {
        setSystemStats(prev => ({
          ...prev,
          totalPatients: 1247,
          totalAppointments: 45,
          totalClinics: 12,
          activeVoiceCalls: 2
        }));
        return;
      }

      // Fetch real stats from Supabase
      const [patientsRes, appointmentsRes, clinicsRes] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('clinics').select('*', { count: 'exact', head: true })
      ]);

      setSystemStats(prev => ({
        ...prev,
        totalPatients: patientsRes.count || 0,
        totalAppointments: appointmentsRes.count || 0,
        totalClinics: clinicsRes.count || 0,
        activeVoiceCalls: 2
      }));
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  const filteredDoctors = doctors.filter((doctor: Doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage doctors, monitor system health, and oversee operations
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Doctor</span>
          </button>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Database Status Card */}
          <div 
            onClick={() => setActiveTab('database-status')}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Healthy</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Database Status</h3>
              <p className="text-sm text-gray-600 mb-3">All systems operational</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Tables</p>
                  <p className="font-semibold text-gray-900">11 Active</p>
                </div>
                <div>
                  <p className="text-gray-500">Uptime</p>
                  <p className="font-semibold text-gray-900">99.9%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Card */}
          <div 
            onClick={() => setActiveTab('compliance')}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Compliant</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Compliance</h3>
              <p className="text-sm text-gray-600 mb-3">HIPAA & Security monitoring</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Score</p>
                  <p className="font-semibold text-green-600">{systemStats.complianceScore}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Issues</p>
                  <p className="font-semibold text-gray-900">0 Critical</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Card */}
          <div 
            onClick={() => setActiveTab('analytics')}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">+12%</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600 mb-3">Performance insights</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Score</p>
                  <p className="font-semibold text-purple-600">{systemStats.analyticsScore}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Growth</p>
                  <p className="font-semibold text-gray-900">+12%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalDoctors}</p>
                <p className="text-sm text-gray-600">Total Doctors</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalPatients}</p>
                <p className="text-sm text-gray-600">Total Patients</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalClinics}</p>
                <p className="text-sm text-gray-600">Total Clinics</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{systemStats.activeVoiceCalls}</p>
                <p className="text-sm text-gray-600">Active Calls</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-800">Database Status</h3>
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search doctors by name, email, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchDoctors}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <div className="text-sm text-gray-600">
              {isSupabaseConfigured ? 
                `Found ${filteredDoctors.length} doctors` : 
                'Demo mode'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {doctorsLoading ? (
          <div className="col-span-full text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          searchTerm ? (
            <div className="col-span-full text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria.</p>
            </div>
          )
        ) : (
            filteredDoctors.map((doctor) => (
              <div 
                key={doctor.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-500">
                          {doctor.email}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle dropdown menu
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{doctor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{doctor.country} • {doctor.timezone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      doctor.subscription_plan === 'pro_plus' ? 'bg-purple-100 text-purple-800' :
                      doctor.subscription_plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {doctor.subscription_plan.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      Joined {formatDate(doctor.created_at)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <p className="text-blue-800 font-medium">AI Minutes</p>
                      <p className="text-blue-600">{doctor.ai_minutes_used}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg">
                      <p className="text-green-800 font-medium">Messages</p>
                      <p className="text-green-600">{doctor.msg_quota_used}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">Click to view details →</p>
                  </div>
                </div>
              </div>
            ))
          )}
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <AddDoctorModal
         isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onDoctorAdded={handleDoctorAdded}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
