import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Clock, Plus, Search, Filter, Edit, Trash2, Users, Calendar } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useClinicContext } from '../../contexts/ClinicContext';
import type { Clinic, Patient, Appointment } from '../../types';
import CreateClinicModal from './CreateClinicModal';

const ClinicList: React.FC = () => {
  const { doctor } = useAuth();
  const { clinics: contextClinics, loading: contextLoading, refreshClinics } = useClinicContext();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clinicStats, setClinicStats] = useState<Record<string, { patients: number; appointments: number }>>({});

  useEffect(() => {
    // Use context clinics if available, otherwise fetch
    if (!contextLoading && contextClinics.length > 0) {
      setClinics(contextClinics);
      setLoading(false);
    } else {
      fetchClinics();
    }
    fetchClinicStats();
  }, [contextClinics, contextLoading]);

  const fetchClinics = async () => {
    try {
      if (!isSupabaseConfigured || !doctor) {
        // Demo data - ensure it matches database schema exactly
        const demoClinics: Clinic[] = [
          {
            id: '1',
            doctor_id: doctor?.id || 'demo-user-id',
            name: 'Main Medical Center',
            address: '123 Health St',
            city: 'New York',
            state: 'NY',
            country: 'US',
            phone: '+1 (555) 123-4567',
            hours_json: {
              monday: { open: '09:00', close: '17:00' },
              tuesday: { open: '09:00', close: '17:00' },
              wednesday: { open: '09:00', close: '17:00' },
              thursday: { open: '09:00', close: '17:00' },
              friday: { open: '09:00', close: '17:00' },
              saturday: { open: '09:00', close: '13:00' },
              sunday: { open: 'closed', close: 'closed' }
            },
            created_at: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            doctor_id: doctor?.id || 'demo-user-id',
            name: 'Downtown Clinic',
            address: '456 Medical Ave',
            city: 'New York',
            state: 'NY',
            country: 'US',
            phone: '+1 (555) 987-6543',
            hours_json: {
              monday: { open: '08:00', close: '18:00' },
              tuesday: { open: '08:00', close: '18:00' },
              wednesday: { open: '08:00', close: '18:00' },
              thursday: { open: '08:00', close: '18:00' },
              friday: { open: '08:00', close: '16:00' },
              saturday: { open: 'closed', close: 'closed' },
              sunday: { open: 'closed', close: 'closed' }
            },
            created_at: '2024-02-01T10:00:00Z'
          },
        ];
        setClinics(demoClinics);
        setLoading(false);
        return;
      }

      // Fetch from database with proper error handling
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('doctor_id', doctor.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClinics(data || []);
    } catch (error) {
      console.error('Error fetching clinics:', error);
      // Fallback to empty array on error
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClinicStats = async () => {
    try {
      if (!doctor) {
        // Demo stats - match the actual clinic IDs
        setClinicStats({
          '1': { patients: 847, appointments: 23 },
          '2': { patients: 400, appointments: 15 }
        });
        return;
      }

      if (!isSupabaseConfigured) {
        // Demo stats - match the actual clinic IDs
        setClinicStats({
          '1': { patients: 847, appointments: 23 },
          '2': { patients: 400, appointments: 15 }
        });
        return;
      }

      // Fetch real stats from database with proper filtering
      const [patientsRes, appointmentsRes] = await Promise.all([
        supabase
          .from('patients')
          .select('clinic_id')
          .eq('doctor_id', doctor?.id),
        supabase
          .from('appointments')
          .select('clinic_id')
          .eq('doctor_id', doctor?.id)
          .gte('start_ts', new Date().toISOString().split('T')[0])
      ]);

      const patients = patientsRes.data;
      const appointments = appointmentsRes.data;

      const stats: Record<string, { patients: number; appointments: number }> = {};
      
      clinics.forEach(clinic => {
        const clinicPatients = patients?.filter(p => p.clinic_id === clinic.id).length || 0;
        const clinicAppointments = appointments?.filter(a => a.clinic_id === clinic.id).length || 0;
        stats[clinic.id] = { patients: clinicPatients, appointments: clinicAppointments };
      });

      setClinicStats(stats);
    } catch (error) {
      console.error('Error fetching clinic stats:', error);
      // Set empty stats on error
      setClinicStats({});
    }
  };

  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatHours = (hours: any) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = hours[today as keyof typeof hours];
    
    if (todayHours?.open === 'closed') {
      return 'Closed today';
    }
    
    return `Open today: ${todayHours?.open} - ${todayHours?.close}`;
  };

  const getTotalStats = () => {
    const totalPatients = Object.values(clinicStats).reduce((sum, stats) => sum + stats.patients, 0);
    const totalAppointments = Object.values(clinicStats).reduce((sum, stats) => sum + stats.appointments, 0);
    return { totalPatients, totalAppointments };
  };

  const { totalPatients, totalAppointments } = getTotalStats();

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading clinics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Clinics</h1>
          <p className="text-gray-600">
            Manage your {clinics.length} clinic locations • {totalPatients} total patients • {totalAppointments} appointments today
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Clinic</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clinics by name, city, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Clinics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClinics.map((clinic) => {
          const stats = clinicStats[clinic.id] || { patients: 0, appointments: 0 };
          
          return (
            <div key={clinic.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
                      <p className="text-sm text-gray-500">
                        Created {new Date(clinic.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {clinic.address}, {clinic.city}, {clinic.state}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{clinic.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatHours(clinic.hours_json)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Patients</span>
                    </div>
                    <p className="text-xl font-bold text-blue-900 mt-1">{stats.patients}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Today</span>
                    </div>
                    <p className="text-xl font-bold text-green-900 mt-1">{stats.appointments}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredClinics.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clinics found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating your first clinic.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Clinic
            </button>
          )}
        </div>
      )}

      {/* Create Clinic Modal */}
      <CreateClinicModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onClinicCreated={() => {
          fetchClinics();
          fetchClinicStats();
          refreshClinics(); // Refresh context as well
        }}
      />
    </div>
  );
};

export default ClinicList;