import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Calendar, 
  FileText, 
  Phone, 
  Shield, 
  BarChart3, 
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Database
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Doctor, Admin, VoiceAgentLog, ComplianceReport } from '../../types';
import AddDoctorModal from './AddDoctorModal';
import DoctorDetailView from './DoctorDetailView';

interface AdminDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab, setActiveTab }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [systemStats, setSystemStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalClinics: 0,
    activeVoiceCalls: 0,
    complianceScore: 95
  });

  useEffect(() => {
    fetchDoctors();
    fetchSystemStats();
  }, []);

  const fetchDoctors = async () => {
    setDoctorsLoading(true);
    try {
      if (!isSupabaseConfigured) {
        // Demo doctors data
        const demoDoctors: Doctor[] = [
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
            email: 'dr.chen@healthcare.com',
            name: 'Dr. Michael Chen',
            country: 'CA',
            phone: '+1 (416) 555-0123',
            timezone: 'America/Toronto',
            subscription_plan: 'starter',
            ai_minutes_used: 120,
            msg_quota_used: 350,
            created_at: '2024-03-10T09:15:00Z'
          }
        ];
        setDoctors(demoDoctors);
        setDoctorsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDoctors(data || []);
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
        setSystemStats({
          totalDoctors: 3,
          totalPatients: 1247,
          totalAppointments: 45,
          totalClinics: 8,
          activeVoiceCalls: 2,
          complianceScore: 95
        });
        return;
      }

      // Fetch real system statistics
      const [doctorsRes, patientsRes, appointmentsRes, clinicsRes] = await Promise.all([
        supabase.from('doctors').select('*', { count: 'exact', head: true }),
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('clinics').select('*', { count: 'exact', head: true })
      ]);

      setSystemStats({
        totalDoctors: doctorsRes.count || 0,
        totalPatients: patientsRes.count || 0,
        totalAppointments: appointmentsRes.count || 0,
        totalClinics: clinicsRes.count || 0,
        activeVoiceCalls: 2, // This would come from voice agent logs
        complianceScore: 95 // This would be calculated from compliance reports
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.phone.includes(searchTerm)
  );

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleBackToList = () => {
    setSelectedDoctor(null);
  };

  if (selectedDoctor) {
    return (
      <DoctorDetailView 
        doctor={selectedDoctor} 
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              System overview and doctor management
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Add Doctor</span>
          </button>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalDoctors}</p>
                <p className="text-sm text-gray-600">Doctors</p>
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
                <p className="text-sm text-gray-600">Patients</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalAppointments}</p>
                <p className="text-sm text-gray-600">Appointments</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalClinics}</p>
                <p className="text-sm text-gray-600">Clinics</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{systemStats.activeVoiceCalls}</p>
                <p className="text-sm text-gray-600">Active Calls</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{systemStats.complianceScore}%</p>
                <p className="text-sm text-gray-600">Compliance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setActiveTab('database-status')}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Database Status</h3>
              <p className="text-sm text-gray-600">Monitor system health</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('voice-agent')}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Voice Agent Logs</h3>
              <p className="text-sm text-gray-600">Review AI call activity</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Compliance</h3>
              <p className="text-sm text-gray-600">Security & audit reports</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">System performance</p>
            </div>
          </div>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctors by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
            />
          </div>
          <button className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2 font-medium">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2 font-medium">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Doctors List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Registered Doctors ({filteredDoctors.length})</h2>
        </div>

        {doctorsLoading ? (
          <div className="p-6 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="p-6 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first doctor.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add First Doctor
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{doctor.email}</span>
                        <span>{doctor.phone}</span>
                        <span className="capitalize">{doctor.subscription_plan.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm">
                      <div className="text-gray-900 font-medium">
                        {doctor.ai_minutes_used} AI mins used
                      </div>
                      <div className="text-gray-600">
                        {doctor.msg_quota_used} messages sent
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDoctor(doctor)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1">
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      <AddDoctorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onDoctorAdded={fetchDoctors}
      />
    </div>
  );
};

export default AdminDashboard;