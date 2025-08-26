import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Tag,
  Calendar,
  Activity,
  MoreVertical,
  Edit,
  Trash2,
  MessageSquare,
  X,
  Building2,
  Save,
  Eye
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import type { Patient } from '../../types';
import { useClinicContext } from '../../contexts/ClinicContext';
import PatientDetailModal from './PatientDetailModal';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientAdded: () => void;
  selectedClinicId: string | null;
  clinics: any[];
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ 
  isOpen, 
  onClose, 
  onPatientAdded, 
  selectedClinicId, 
  clinics 
}) => {
  const { doctor } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    clinicId: selectedClinicId || (clinics.length > 0 ? clinics[0].id : '')
  });

  useEffect(() => {
    if (selectedClinicId) {
      setFormData(prev => ({ ...prev, clinicId: selectedClinicId }));
    }
  }, [selectedClinicId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!doctor) {
        throw new Error('Doctor information not available');
      }

      if (!formData.clinicId) {
        throw new Error('Please select a clinic');
      }

      const patientData = {
        doctor_id: doctor.id,
        clinic_id: formData.clinicId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        dob: '1990-01-01', // Default DOB - can be updated later
        sex: 'other' as const, // Default sex - can be updated later
        phone: formData.mobileNumber,
        email: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@example.com`, // Temporary email
        consent_flags_json: {
          messaging: true,
          marketing: false,
          voice_calls: true
        },
        tags: []
      };

      if (!isSupabaseConfigured) {
        // Demo mode
        setSuccess(`Demo: Patient "${formData.firstName} ${formData.lastName}" would be added to ${clinics.find(c => c.id === formData.clinicId)?.name}!`);
        setTimeout(() => {
          onPatientAdded();
          handleClose();
        }, 2000);
        return;
      }

      const { error: insertError } = await supabase
        .from('patients')
        .insert([patientData]);

      if (insertError) {
        throw insertError;
      }

      setSuccess(`Patient "${formData.firstName} ${formData.lastName}" added successfully!`);
      onPatientAdded();
      
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err: any) {
      console.error('Error adding patient:', err);
      setError(err.message || 'Failed to add patient');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      mobileNumber: '',
      clinicId: selectedClinicId || (clinics.length > 0 ? clinics[0].id : '')
    });
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add New Patient</h2>
                <p className="text-sm text-gray-500">Create a new patient record</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                placeholder="Smith"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mobile Number *
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Clinic *
            </label>
            <div className="relative">
              <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={formData.clinicId}
                onChange={(e) => setFormData({ ...formData, clinicId: e.target.value })}
                className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors appearance-none"
                required
              >
                <option value="">Select a clinic</option>
                {clinics.map(clinic => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-800 text-sm font-medium">{success}</p>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Adding...' : 'Add Patient'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PatientList: React.FC = () => {
  const { doctor, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const { selectedClinic, clinics } = useClinicContext();

  useEffect(() => {
    if (!authLoading && doctor) {
      fetchPatients();
    }
  }, [selectedClinic, doctor, authLoading]);

  const fetchPatients = async () => {
    if (!doctor || !doctor.id) {
      console.error('Doctor information not available');
      setLoading(false);
      return;
    }

    try {
      if (!isSupabaseConfigured) {
        // Enhanced demo data with more realistic information
        const mockPatients: Patient[] = [
          {
            id: '1',
            doctor_id: doctor.id,
            clinic_id: '1',
            first_name: 'John',
            last_name: 'Smith',
            dob: '1985-06-15',
            sex: 'male',
            phone: '+1 (555) 123-4567',
            email: 'john.smith@email.com',
            consent_flags_json: {
              messaging: true,
              marketing: false,
              voice_calls: true
            },
            tags: ['diabetes', 'hypertension'],
            created_at: '2024-01-15T10:00:00Z',
            vitals: {
              height: 175,
              weight: 80,
              blood_pressure: '120/80',
              temperature: 98.6
            },
            chief_complaint: 'Regular checkup'
          },
          {
            id: '2',
            doctor_id: doctor.id,
            clinic_id: '1',
            first_name: 'Sarah',
            last_name: 'Johnson',
            dob: '1990-03-22',
            sex: 'female',
            phone: '+1 (555) 987-6543',
            email: 'sarah.johnson@email.com',
            consent_flags_json: {
              messaging: true,
              marketing: true,
              voice_calls: true
            },
            tags: ['allergies'],
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
            id: '3',
            doctor_id: doctor.id,
            clinic_id: '2',
            first_name: 'Michael',
            last_name: 'Davis',
            dob: '1978-11-10',
            sex: 'male',
            phone: '+1 (555) 456-7890',
            email: 'michael.davis@email.com',
            consent_flags_json: {
              messaging: true,
              marketing: false,
              voice_calls: true
            },
            tags: ['cardiac'],
            created_at: '2024-02-01T09:15:00Z',
            vitals: {
              height: 180,
              weight: 85,
              blood_pressure: '130/85',
              temperature: 98.7
            },
            chief_complaint: 'Cardiac consultation'
          },
          {
            id: '4',
            doctor_id: doctor.id,
            clinic_id: '2',
            first_name: 'Emma',
            last_name: 'Wilson',
            dob: '1992-07-25',
            sex: 'female',
            phone: '+1 (555) 789-0123',
            email: 'emma.wilson@email.com',
            consent_flags_json: {
              messaging: true,
              marketing: true,
              voice_calls: false
            },
            tags: ['dermatology'],
            created_at: '2024-02-05T16:45:00Z',
            vitals: {
              height: 168,
              weight: 62,
              blood_pressure: '115/75',
              temperature: 98.2
            },
            chief_complaint: 'Skin condition'
          },
          {
            id: '5',
            doctor_id: doctor.id,
            clinic_id: '1',
            first_name: 'Robert',
            last_name: 'Chen',
            dob: '1975-09-18',
            sex: 'male',
            phone: '+1 (555) 321-0987',
            email: 'robert.chen@email.com',
            consent_flags_json: {
              messaging: true,
              marketing: false,
              voice_calls: true
            },
            tags: ['orthopedic'],
            created_at: '2024-02-10T11:20:00Z',
            vitals: {
              height: 172,
              weight: 78,
              blood_pressure: '125/82',
              temperature: 98.5
            },
            chief_complaint: 'Knee pain'
          }
        ];
        
        // Filter by selected clinic
        const filteredPatients = selectedClinic && selectedClinic !== 'all'
          ? mockPatients.filter(patient => patient.clinic_id === selectedClinic)
          : mockPatients;
        
        setPatients(filteredPatients);
        setLoading(false);
        return;
      }

      // Fetch from database with proper filtering
      let query = supabase
        .from('patients')
        .select('*')
        .eq('doctor_id', doctor.id);

      // Filter by selected clinic if one is selected
      if (selectedClinic && selectedClinic !== 'all') {
        query = query.eq('clinic_id', selectedClinic);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getAge = (dob: string) => {
    return new Date().getFullYear() - new Date(dob).getFullYear();
  };

  const getClinicName = (clinicId: string) => {
    return clinics.find(c => c.id === clinicId)?.name || 'Unknown Clinic';
  };

  const handleViewPatient = (patient: Patient) => {
    setViewingPatient(patient);
    setShowDetailModal(true);
  };
  if (loading || authLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{authLoading ? 'Authenticating...' : 'Loading patients...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600 mt-1">
              {selectedClinic && selectedClinic !== 'all'
                ? `${filteredPatients.length} patients at ${getClinicName(selectedClinic)}`
                : `${filteredPatients.length} patients across all clinics`
              }
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Add Patient</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{filteredPatients.length}</p>
                <p className="text-sm text-gray-600">Total Patients</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Appointments Today</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-600">Active Cases</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-600">Messages Sent</p>
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
              placeholder="Search patients by name, phone, or email..."
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

      {/* Patient Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
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
                  <button
                    onClick={() => setSelectedPatient(selectedPatient === patient.id ? null : patient.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  {selectedPatient === patient.id && (
                    <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-2 w-40">
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => {
                          handleViewPatient(patient);
                          setSelectedPatient(null);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600">
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{patient.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{patient.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{getClinicName(patient.clinic_id)}</span>
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

              <div className="flex items-center space-x-2 mb-4">
                {patient.consent_flags_json.messaging && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Messaging</span>
                  </div>
                )}
                {patient.consent_flags_json.marketing && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Marketing</span>
                  </div>
                )}
                {patient.consent_flags_json.voice_calls && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Voice</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewPatient(patient)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                  Schedule
                </button>
                <button className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first patient.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
            >
              Add Your First Patient
            </button>
          )}
        </div>
      )}

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onPatientAdded={fetchPatients}
        selectedClinicId={selectedClinic !== 'all' ? selectedClinic : null}
        clinics={clinics}
      />

      {/* Patient Detail Modal */}
      {viewingPatient && (
        <PatientDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setViewingPatient(null);
          }}
          patient={viewingPatient}
          onPatientUpdated={fetchPatients}
        />
      )}
    </div>
  );
};

export default PatientList;