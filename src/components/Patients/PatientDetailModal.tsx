import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  Plus, 
  Eye,
  Download,
  Send,
  Activity,
  Heart,
  Thermometer,
  Weight,
  Ruler,
  Clock,
  Building2
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useClinicContext } from '../../contexts/ClinicContext';
import type { Patient, Prescription, Appointment } from '../../types';
import CreatePrescriptionModal from '../Prescriptions/CreatePrescriptionModal';
import ViewPrescriptionModal from '../Prescriptions/ViewPrescriptionModal';

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onPatientUpdated?: () => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  patient,
  onPatientUpdated 
}) => {
  const { doctor } = useAuth();
  const { clinics } = useClinicContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreatePrescription, setShowCreatePrescription] = useState(false);
  const [showViewPrescription, setShowViewPrescription] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    if (isOpen && patient) {
      fetchPatientData();
    }
  }, [isOpen, patient]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchPrescriptions(),
        fetchAppointments()
      ]);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      if (!isSupabaseConfigured) {
        // Demo prescriptions for this patient
        const demoPrescriptions: Prescription[] = [
          {
            id: '1',
            doctor_id: doctor?.id || '',
            clinic_id: patient.clinic_id,
            patient_id: patient.id,
            rx_json: {
              medications: [
                {
                  name: 'Metformin',
                  dosage: '500mg',
                  frequency: 'Twice daily',
                  duration: '30 days',
                  notes: 'Take with meals'
                },
                {
                  name: 'Lisinopril',
                  dosage: '10mg',
                  frequency: 'Once daily',
                  duration: '30 days',
                  notes: 'Take in the morning'
                }
              ],
              instructions: 'Monitor blood sugar levels daily. Follow up in 2 weeks.',
              follow_up: '2 weeks'
            },
            pdf_url: null,
            signed_by: doctor?.name || 'Dr. Demo',
            signed_ts: new Date().toISOString(),
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            doctor_id: doctor?.id || '',
            clinic_id: patient.clinic_id,
            patient_id: patient.id,
            rx_json: {
              medications: [
                {
                  name: 'Vitamin D3',
                  dosage: '1000 IU',
                  frequency: 'Once daily',
                  duration: '90 days',
                  notes: 'Take with food'
                }
              ],
              instructions: 'Continue current diet and exercise routine',
              follow_up: '3 months'
            },
            pdf_url: null,
            signed_by: doctor?.name || 'Dr. Demo',
            signed_ts: new Date().toISOString(),
            created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        setPrescriptions(demoPrescriptions);
        return;
      }

      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('patient_id', patient.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrescriptions(data || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setPrescriptions([]);
    }
  };

  const fetchAppointments = async () => {
    try {
      if (!isSupabaseConfigured) {
        // Demo appointments for this patient
        const demoAppointments: Appointment[] = [
          {
            id: '1',
            doctor_id: doctor?.id || '',
            clinic_id: patient.clinic_id,
            patient_id: patient.id,
            start_ts: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            end_ts: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
            status: 'booked',
            channel: 'manual',
            notes: 'Follow-up consultation',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            doctor_id: doctor?.id || '',
            clinic_id: patient.clinic_id,
            patient_id: patient.id,
            start_ts: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            end_ts: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
            status: 'complete',
            channel: 'voice',
            notes: 'Initial consultation',
            created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        setAppointments(demoAppointments);
        return;
      }

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patient.id)
        .order('start_ts', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    }
  };

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowViewPrescription(true);
  };

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

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getClinicName = (clinicId: string) => {
    return clinics.find(c => c.id === clinicId)?.name || 'Unknown Clinic';
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'vitals', label: 'Vitals', icon: Activity }
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {patient.first_name} {patient.last_name}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>{getAge(patient.dob)} years old</span>
                    <span className="capitalize">{patient.sex}</span>
                    <span>{patient.phone}</span>
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{getClinicName(patient.clinic_id)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowCreatePrescription(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Prescription</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading patient data...</p>
              </div>
            )}

            {!loading && activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Patient Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Personal Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">Date of Birth:</span>
                        <span className="text-blue-700">{formatDate(patient.dob)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">Age:</span>
                        <span className="text-blue-700">{getAge(patient.dob)} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">Sex:</span>
                        <span className="text-blue-700 capitalize">{patient.sex}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">Phone:</span>
                        <span className="text-blue-700">{patient.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">Email:</span>
                        <span className="text-blue-700">{patient.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">Medical Information</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-green-800">Medical Tags:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {patient.tags.length > 0 ? patient.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              {tag}
                            </span>
                          )) : (
                            <span className="text-green-600 text-xs">No tags assigned</span>
                          )}
                        </div>
                      </div>
                      {patient.chief_complaint && (
                        <div>
                          <span className="font-medium text-green-800">Chief Complaint:</span>
                          <p className="text-green-700 mt-1">{patient.chief_complaint}</p>
                        </div>
                      )}
                      {patient.notes && (
                        <div>
                          <span className="font-medium text-green-800">Notes:</span>
                          <p className="text-green-700 mt-1">{patient.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Consent Flags */}
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">Consent & Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${patient.consent_flags_json.messaging ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-purple-700">Messaging</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${patient.consent_flags_json.messaging ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {patient.consent_flags_json.messaging ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${patient.consent_flags_json.marketing ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-purple-700">Marketing</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${patient.consent_flags_json.marketing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {patient.consent_flags_json.marketing ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${patient.consent_flags_json.voice_calls ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-purple-700">Voice Calls</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${patient.consent_flags_json.voice_calls ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {patient.consent_flags_json.voice_calls ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
                        <p className="text-sm text-gray-600">Prescriptions</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                        <p className="text-sm text-gray-600">Appointments</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatDate(patient.created_at)}
                        </p>
                        <p className="text-sm text-gray-600">Patient Since</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!loading && activeTab === 'prescriptions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Prescriptions ({prescriptions.length})
                  </h3>
                  <button
                    onClick={() => setShowCreatePrescription(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Prescription</span>
                  </button>
                </div>
                
                {prescriptions.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h4>
                    <p className="text-gray-600 mb-6">This patient doesn't have any prescriptions yet.</p>
                    <button
                      onClick={() => setShowCreatePrescription(true)}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Create First Prescription
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div key={prescription.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                Prescription #{prescription.id.slice(0, 8)}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {formatDateTime(prescription.signed_ts)} • Signed by {prescription.signed_by}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Active
                            </span>
                            <button
                              onClick={() => handleViewPrescription(prescription)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Medications Preview */}
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-gray-700 mb-2">
                            Medications ({prescription.rx_json.medications.length}):
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {prescription.rx_json.medications.slice(0, 4).map((medication, index) => (
                              <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-blue-900">{medication.name}</span>
                                  <span className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                                    {medication.dosage}
                                  </span>
                                </div>
                                <div className="text-sm text-blue-600">
                                  <p>{medication.frequency}</p>
                                  {medication.duration && <p className="text-xs">{medication.duration}</p>}
                                </div>
                              </div>
                            ))}
                            {prescription.rx_json.medications.length > 4 && (
                              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                                <span className="text-sm text-gray-600">
                                  +{prescription.rx_json.medications.length - 4} more medications
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Instructions & Follow-up */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {prescription.rx_json.instructions && (
                            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                              <h6 className="text-sm font-semibold text-yellow-800 mb-1">Instructions:</h6>
                              <p className="text-sm text-yellow-700">{prescription.rx_json.instructions}</p>
                            </div>
                          )}
                          {prescription.rx_json.follow_up && (
                            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                              <h6 className="text-sm font-semibold text-purple-800 mb-1">Follow-up:</h6>
                              <p className="text-sm text-purple-700">{prescription.rx_json.follow_up}</p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="text-xs text-gray-500">
                            Created {formatDate(prescription.created_at)}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewPrescription(prescription)}
                              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              View Full Details
                            </button>
                            <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1">
                              <Download className="w-4 h-4" />
                              <span>PDF</span>
                            </button>
                            <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1">
                              <Send className="w-4 h-4" />
                              <span>Send</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!loading && activeTab === 'appointments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Appointments ({appointments.length})
                  </h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Schedule Appointment</span>
                  </button>
                </div>
                
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h4>
                    <p className="text-gray-600 mb-6">This patient doesn't have any appointments scheduled.</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      Schedule First Appointment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {formatDateTime(appointment.start_ts)}
                            </h4>
                            <p className="text-sm text-gray-600 capitalize">
                              {appointment.channel} • Duration: 30 minutes
                            </p>
                            {appointment.notes && (
                              <p className="text-sm text-gray-700 mt-1">{appointment.notes}</p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                            appointment.status === 'complete' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!loading && activeTab === 'vitals' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Vital Signs</h3>
                
                {patient.vitals ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <Ruler className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-800">Height</p>
                          <p className="text-2xl font-bold text-blue-900">{patient.vitals.height}cm</p>
                        </div>
                      </div>
                      <p className="text-xs text-blue-600">
                        {(patient.vitals.height / 100 * 3.28084).toFixed(1)} feet
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <Weight className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800">Weight</p>
                          <p className="text-2xl font-bold text-green-900">{patient.vitals.weight}kg</p>
                        </div>
                      </div>
                      <p className="text-xs text-green-600">
                        BMI: {(patient.vitals.weight / Math.pow(patient.vitals.height / 100, 2)).toFixed(1)}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-800">Blood Pressure</p>
                          <p className="text-2xl font-bold text-red-900">{patient.vitals.blood_pressure}</p>
                        </div>
                      </div>
                      <p className="text-xs text-red-600">mmHg</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                          <Thermometer className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-800">Temperature</p>
                          <p className="text-2xl font-bold text-orange-900">{patient.vitals.temperature}°F</p>
                        </div>
                      </div>
                      <p className="text-xs text-orange-600">
                        {((patient.vitals.temperature - 32) * 5/9).toFixed(1)}°C
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No vital signs recorded</h4>
                    <p className="text-gray-600 mb-6">No vital signs have been recorded for this patient yet.</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      Record Vitals
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Prescription Modal */}
      <CreatePrescriptionModal
        isOpen={showCreatePrescription}
        onClose={() => setShowCreatePrescription(false)}
        onPrescriptionCreated={() => {
          fetchPrescriptions();
          setShowCreatePrescription(false);
        }}
        preselectedPatient={patient}
      />

      {/* View Prescription Modal */}
      {selectedPrescription && (
        <ViewPrescriptionModal
          isOpen={showViewPrescription}
          onClose={() => {
            setShowViewPrescription(false);
            setSelectedPrescription(null);
          }}
          prescription={selectedPrescription}
        />
      )}
    </>
  );
};

export default PatientDetailModal;