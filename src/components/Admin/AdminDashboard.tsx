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
  Database
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Doctor } from '../../types';
import AddDoctorModal from './AddDoctorModal';

interface AdminDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab, setActiveTab }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    fetchDoctors();
    fetchSystemStats();
  }, []);

  const fetchDoctors = async () => {
    setDoctorsLoading(true);
    try {
      console.log('Supabase configured:', isSupabaseConfigured);
      console.log('Supabase client:', supabase);
      
      // Try to fetch from Supabase first, fallback to demo if it fails
      try {
        console.log('Attempting to fetch doctors from Supabase...');
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase fetch error:', error);
          throw error;
        }

        console.log('Successfully fetched doctors from Supabase:', data);
        setDoctors(data || []);
        return;
      } catch (supabaseError) {
        console.warn('Failed to fetch from Supabase, using demo data:', supabaseError);
      }

      // Fallback to demo data
      console.log('Using demo data');
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
          },
          {
            id: 'doctor-4',
            email: 'dr.williams@clinic.org',
            name: 'Dr. Emily Williams',
            country: 'GB',
            phone: '+44 20 7946 0958',
            timezone: 'Europe/London',
            subscription_plan: 'pro',
            ai_minutes_used: 320,
            msg_quota_used: 890,
            created_at: '2024-03-15T14:20:00Z'
          },
          {
            id: 'doctor-5',
            email: 'dr.rodriguez@health.es',
            name: 'Dr. Carlos Rodriguez',
            country: 'ES',
            phone: '+34 91 123 4567',
            timezone: 'Europe/Madrid',
            subscription_plan: 'starter',
            ai_minutes_used: 85,
            msg_quota_used: 245,
            created_at: '2024-03-20T09:30:00Z'
          },
          {
            id: 'doctor-6',
            email: 'dr.patel@medical.in',
            name: 'Dr. Priya Patel',
            country: 'IN',
            phone: '+91 98765 43210',
            timezone: 'Asia/Kolkata',
            subscription_plan: 'pro_plus',
            ai_minutes_used: 650,
            msg_quota_used: 1850,
            created_at: '2024-03-25T11:45:00Z'
          }
        ];
        setDoctors(demoDoctors);
      setDoctorsLoading(false);
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
          totalDoctors: 6,
          totalPatients: 1247,
          totalAppointments: 45,
          totalClinics: 12,
          activeVoiceCalls: 2,
          complianceScore: 95,
          databaseHealth: 'excellent',
          analyticsScore: 92
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
        activeVoiceCalls: 2,
        complianceScore: 95,
        databaseHealth: 'excellent',
        analyticsScore: 92
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  const fetchDoctorClinics = async (doctorId: string) => {
    setClinicsLoading(true);
    try {
      if (!isSupabaseConfigured) {
        // Demo clinics for selected doctor
        const demoClinics: Clinic[] = [
          {
            id: 'clinic-1',
            doctor_id: doctorId,
            name: 'Main Medical Center',
            address: '123 Health Street',
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
            id: 'clinic-2',
            doctor_id: doctorId,
            name: 'Downtown Clinic',
            address: '456 Medical Avenue',
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
          {
            id: 'clinic-3',
            doctor_id: doctorId,
            name: 'Wellness Center',
            address: '789 Wellness Boulevard',
            city: 'Brooklyn',
            state: 'NY',
            country: 'US',
            phone: '+1 (555) 456-7890',
            hours_json: {
              monday: { open: '07:00', close: '19:00' },
              tuesday: { open: '07:00', close: '19:00' },
              wednesday: { open: '07:00', close: '19:00' },
              thursday: { open: '07:00', close: '19:00' },
              friday: { open: '07:00', close: '17:00' },
              saturday: { open: '08:00', close: '14:00' },
              sunday: { open: 'closed', close: 'closed' }
            },
            created_at: '2024-02-15T12:30:00Z'
          }
        ];
        setDoctorClinics(demoClinics);
        setClinicsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDoctorClinics(data || []);
    } catch (error) {
      console.error('Error fetching doctor clinics:', error);
      setDoctorClinics([]);
    } finally {
      setClinicsLoading(false);
    }
  };

  const fetchClinicPatients = async (clinicId: string) => {
    setPatientsLoading(true);
    try {
      if (!isSupabaseConfigured) {
        // Demo patients for selected clinic
        const demoPatients: Patient[] = [
          {
            id: 'patient-1',
            doctor_id: selectedDoctor?.id || '',
            clinic_id: clinicId,
            first_name: 'John',
            last_name: 'Smith',
            dob: '1985-06-15',
            sex: 'male',
            phone: '+1 (555) 123-4567',
            email: 'john.smith@email.com',
            consent_flags_json: { messaging: true, marketing: false, voice_calls: true },
            tags: ['diabetes', 'hypertension'],
            created_at: '2024-01-15T10:00:00Z',
            vitals: {
              height: 175,
              weight: 80,
              blood_pressure: '120/80',
              temperature: 98.6
            },
            chief_complaint: 'Regular diabetes checkup'
          },
          {
            id: 'patient-2',
            doctor_id: selectedDoctor?.id || '',
            clinic_id: clinicId,
            first_name: 'Sarah',
            last_name: 'Johnson',
            dob: '1990-03-22',
            sex: 'female',
            phone: '+1 (555) 987-6543',
            email: 'sarah.johnson@email.com',
            consent_flags_json: { messaging: true, marketing: true, voice_calls: true },
            tags: ['allergies', 'asthma'],
            created_at: '2024-01-20T14:30:00Z',
            vitals: {
              height: 165,
              weight: 65,
              blood_pressure: '110/70',
              temperature: 98.4
            },
            chief_complaint: 'Allergy consultation'
          },
          {
            id: 'patient-3',
            doctor_id: selectedDoctor?.id || '',
            clinic_id: clinicId,
            first_name: 'Michael',
            last_name: 'Davis',
            dob: '1978-11-10',
            sex: 'male',
            phone: '+1 (555) 456-7890',
            email: 'michael.davis@email.com',
            consent_flags_json: { messaging: true, marketing: false, voice_calls: true },
            tags: ['cardiac', 'hypertension'],
            created_at: '2024-02-01T09:15:00Z',
            vitals: {
              height: 180,
              weight: 85,
              blood_pressure: '130/85',
              temperature: 98.7
            },
            chief_complaint: 'Cardiac evaluation'
          },
          {
            id: 'patient-4',
            doctor_id: selectedDoctor?.id || '',
            clinic_id: clinicId,
            first_name: 'Emma',
            last_name: 'Wilson',
            dob: '1992-07-25',
            sex: 'female',
            phone: '+1 (555) 789-0123',
            email: 'emma.wilson@email.com',
            consent_flags_json: { messaging: true, marketing: true, voice_calls: false },
            tags: ['dermatology'],
            created_at: '2024-02-05T16:45:00Z',
            vitals: {
              height: 168,
              weight: 62,
              blood_pressure: '115/75',
              temperature: 98.2
            },
            chief_complaint: 'Skin condition evaluation'
          },
          {
            id: 'patient-5',
            doctor_id: selectedDoctor?.id || '',
            clinic_id: clinicId,
            first_name: 'Robert',
            last_name: 'Chen',
            dob: '1975-09-18',
            sex: 'male',
            phone: '+1 (555) 321-0987',
            email: 'robert.chen@email.com',
            consent_flags_json: { messaging: true, marketing: false, voice_calls: true },
            tags: ['orthopedic'],
            created_at: '2024-02-10T11:20:00Z',
            vitals: {
              height: 172,
              weight: 78,
              blood_pressure: '125/82',
              temperature: 98.5
            },
            chief_complaint: 'Knee pain consultation'
          }
        ];
        setClinicPatients(demoPatients);
        setPatientsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('clinic_id', clinicId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClinicPatients(data || []);
    } catch (error) {
      console.error('Error fetching clinic patients:', error);
      setClinicPatients([]);
    } finally {
      setPatientsLoading(false);
    }
  };

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedClinic(null);
    setClinicPatients([]);
    fetchDoctorClinics(doctor.id);
  };

  const handleClinicClick = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    fetchClinicPatients(clinic.id);
  };

  const handleBackToDoctors = () => {
    setSelectedDoctor(null);
    setSelectedClinic(null);
    setDoctorClinics([]);
    setClinicPatients([]);
  };

  const handleBackToClinics = () => {
    setSelectedClinic(null);
    setClinicPatients([]);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.phone.includes(searchTerm)
  );

  const getAge = (dob: string) => {
    return new Date().getFullYear() - new Date(dob).getFullYear();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render patient details view
  if (selectedClinic && selectedDoctor) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Breadcrumb Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button 
              onClick={handleBackToDoctors}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              All Doctors
            </button>
            <span>/</span>
            <button 
              onClick={handleBackToClinics}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {selectedDoctor.name}
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{selectedClinic.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToClinics}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedClinic.name} - Patients
                </h1>
                <p className="text-gray-600 mt-1">
                  {clinicPatients.length} patients at this clinic
                </p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg">
              <Plus className="w-5 h-5" />
              <span>Add Patient</span>
            </button>
          </div>
        </div>

        {/* Clinic Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{selectedClinic.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedClinic.address}, {selectedClinic.city}, {selectedClinic.state}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{selectedClinic.phone}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{clinicPatients.length}</p>
              <p className="text-sm text-gray-600">Total Patients</p>
            </div>
          </div>
        </div>

        {/* Patients Grid */}
        {patientsLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading patients...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {clinicPatients.map((patient) => (
              <div key={patient.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {patient.first_name} {patient.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {getAge(patient.dob)} years • {patient.sex}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{patient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">DOB: {formatDate(patient.dob)}</span>
                    </div>
                  </div>

                  {patient.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {patient.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {patient.chief_complaint && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Chief Complaint:</span> {patient.chief_complaint}
                      </p>
                    </div>
                  )}

                  {patient.vitals && (
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="bg-green-50 p-2 rounded-lg">
                        <p className="text-green-800 font-medium">Height</p>
                        <p className="text-green-600">{patient.vitals.height}cm</p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <p className="text-blue-800 font-medium">Weight</p>
                        <p className="text-blue-600">{patient.vitals.weight}kg</p>
                      </div>
                      <div className="bg-purple-50 p-2 rounded-lg">
                        <p className="text-purple-800 font-medium">BP</p>
                        <p className="text-purple-600">{patient.vitals.blood_pressure}</p>
                      </div>
                      <div className="bg-orange-50 p-2 rounded-lg">
                        <p className="text-orange-800 font-medium">Temp</p>
                        <p className="text-orange-600">{patient.vitals.temperature}°F</p>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {clinicPatients.length === 0 && !patientsLoading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600 mb-6">This clinic doesn't have any patients yet.</p>
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg">
              Add First Patient
            </button>
          </div>
        )}
      </div>
    );
  }

  // Render clinics view for selected doctor
  if (selectedDoctor) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Breadcrumb Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button 
              onClick={handleBackToDoctors}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              All Doctors
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{selectedDoctor.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDoctors}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedDoctor.name} - Clinics
                </h1>
                <p className="text-gray-600 mt-1">
                  {doctorClinics.length} clinic locations
                </p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg">
              <Plus className="w-5 h-5" />
              <span>Add Clinic</span>
            </button>
          </div>
        </div>

        {/* Doctor Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{selectedDoctor.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span>{selectedDoctor.email}</span>
                <span>{selectedDoctor.phone}</span>
                <span className="capitalize">{selectedDoctor.subscription_plan.replace('_', ' ')}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">AI Minutes Used</p>
              <p className="text-2xl font-bold text-blue-600">{selectedDoctor.ai_minutes_used}</p>
            </div>
          </div>
        </div>

        {/* Clinics Grid */}
        {clinicsLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading clinics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {doctorClinics.map((clinic) => (
              <div 
                key={clinic.id} 
                onClick={() => handleClinicClick(clinic)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{clinic.name}</h3>
                        <p className="text-sm text-gray-500">
                          Created {formatDate(clinic.created_at)}
                        </p>
                      </div>
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
                      <span className="text-sm">
                        {clinic.hours_json.monday.open === 'closed' ? 'Closed today' : 
                         `Open: ${clinic.hours_json.monday.open} - ${clinic.hours_json.monday.close}`}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Patients</span>
                      </div>
                      <p className="text-xl font-bold text-blue-900 mt-1">
                        {Math.floor(Math.random() * 200) + 50}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Today</span>
                      </div>
                      <p className="text-xl font-bold text-green-900 mt-1">
                        {Math.floor(Math.random() * 15) + 3}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">Click to view patients →</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {doctorClinics.length === 0 && !clinicsLoading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No clinics found</h3>
            <p className="text-gray-600 mb-6">This doctor doesn't have any clinics yet.</p>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg">
              Add First Clinic
            </button>
          </div>
        )}
      </div>
    );
  }

  // Main doctors view
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
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

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {doctorsLoading ? (
          <div className="col-span-full text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first doctor.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
              >
                Add First Doctor
              </button>
            )}
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div 
              key={doctor.id} 
              onClick={() => handleDoctorClick(doctor)}
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
                  <p className="text-sm text-blue-800 font-medium">Click to view clinics →</p>
                </div>
              </div>
            </div>
          ))
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