import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Video, MapPin, Save, Search, Building2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useClinicContext } from '../../contexts/ClinicContext';
import type { Patient } from '../../types';

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentCreated: () => void;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({ 
  isOpen, 
  onClose, 
  onAppointmentCreated 
}) => {
  const { doctor } = useAuth();
  const { selectedClinic, clinics } = useClinicContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientList, setShowPatientList] = useState(false);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    patientId: '',
    clinicId: selectedClinic !== 'all' ? selectedClinic || '' : '',
    date: '',
    startTime: '',
    endTime: '',
    channel: 'manual' as 'voice' | 'web' | 'manual',
    notes: ''
  });

  useEffect(() => {
    if (isOpen && doctor) {
      fetchPatients();
      fetchExistingAppointments();
    }
  }, [isOpen, doctor]);

  useEffect(() => {
    // Filter patients based on search term
    const filtered = patients.filter(patient =>
      `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(patientSearch.toLowerCase()) ||
      patient.phone.includes(patientSearch) ||
      patient.email.toLowerCase().includes(patientSearch.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [patients, patientSearch]);

  const fetchPatients = async () => {
    if (!doctor) return;

    try {
      if (!isSupabaseConfigured) {
        // Demo patients data
        const demoPatients: Patient[] = [
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
            consent_flags_json: { messaging: true, marketing: false, voice_calls: true },
            tags: ['diabetes', 'hypertension'],
            created_at: '2024-01-15T10:00:00Z'
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
            consent_flags_json: { messaging: true, marketing: true, voice_calls: true },
            tags: ['allergies'],
            created_at: '2024-01-20T14:30:00Z'
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
            consent_flags_json: { messaging: true, marketing: false, voice_calls: true },
            tags: ['cardiac'],
            created_at: '2024-02-01T09:15:00Z'
          },
          {
            id: '4',
            doctor_id: doctor.id,
            clinic_id: '1',
            first_name: 'Emma',
            last_name: 'Wilson',
            dob: '1992-07-25',
            sex: 'female',
            phone: '+1 (555) 789-0123',
            email: 'emma.wilson@email.com',
            consent_flags_json: { messaging: true, marketing: true, voice_calls: false },
            tags: ['dermatology'],
            created_at: '2024-02-05T16:45:00Z'
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
            consent_flags_json: { messaging: true, marketing: false, voice_calls: true },
            tags: ['orthopedic'],
            created_at: '2024-02-10T11:20:00Z'
          }
        ];

        setPatients(demoPatients);
        setFilteredPatients(demoPatients);
        return;
      }

      // Fetch from database
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('doctor_id', doctor.id)
        .order('first_name', { ascending: true });

      if (error) throw error;

      setPatients(data || []);
      setFilteredPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
      setFilteredPatients([]);
    }
  };

  const fetchExistingAppointments = async () => {
    if (!doctor) return;

    try {
      if (!isSupabaseConfigured) {
        // Demo mode - set some existing appointments for validation testing
        setExistingAppointments([
          {
            id: '1',
            start_ts: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            end_ts: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
            clinic_id: '1'
          }
        ]);
        return;
      }

      // Fetch existing appointments for the doctor
      const { data, error } = await supabase
        .from('appointments')
        .select('id, start_ts, end_ts, clinic_id')
        .eq('doctor_id', doctor.id)
        .eq('status', 'booked');

      if (error) throw error;
      setExistingAppointments(data || []);
    } catch (error) {
      console.error('Error fetching existing appointments:', error);
      setExistingAppointments([]);
    }
  };

  const checkTimeConflict = (newStart: string, newEnd: string, clinicId: string) => {
    const newStartTime = new Date(newStart);
    const newEndTime = new Date(newEnd);

    return existingAppointments.some(appointment => {
      // Only check appointments at the same clinic
      if (appointment.clinic_id !== clinicId) return false;

      const existingStart = new Date(appointment.start_ts);
      const existingEnd = new Date(appointment.end_ts);

      // Check for time overlap
      return (
        (newStartTime >= existingStart && newStartTime < existingEnd) ||
        (newEndTime > existingStart && newEndTime <= existingEnd) ||
        (newStartTime <= existingStart && newEndTime >= existingEnd)
      );
    });
  };

  const handlePatientSelect = (patient: Patient) => {
    setFormData(prev => ({ ...prev, patientId: patient.id }));
    setPatientSearch(`${patient.first_name} ${patient.last_name}`);
    setShowPatientList(false);
  };

  const calculateEndTime = (startTime: string) => {
    if (!startTime) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    
    // Add 30 minutes to start time
    let endHours = hours;
    let endMinutes = minutes + 30;
    
    // Handle minute overflow
    if (endMinutes >= 60) {
      endHours += Math.floor(endMinutes / 60);
      endMinutes = endMinutes % 60;
    }
    
    // If the end time would be the next day, cap it at 23:59
    if (endHours >= 24) {
      endHours = 23;
      endMinutes = 59;
    }
    
    // Format as HH:MM
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const handleStartTimeChange = (time: string) => {
    setFormData(prev => ({
      ...prev,
      startTime: time,
      endTime: calculateEndTime(time)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!doctor) {
        throw new Error('Doctor information not available');
      }

      if (!formData.patientId) {
        throw new Error('Please select a patient');
      }

      if (!formData.clinicId) {
        throw new Error('Please select a clinic');
      }

      // Create datetime strings
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`).toISOString();
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`).toISOString();

      // Check for time conflicts
      // if (checkTimeConflict(startDateTime, endDateTime, formData.clinicId)) {
      //   throw new Error('This time slot is already booked. Please choose a different time.');
      // }

      const appointmentData = {
        doctor_id: doctor.id,
        clinic_id: formData.clinicId,
        patient_id: formData.patientId,
        start_ts: startDateTime,
        end_ts: endDateTime,
        status: 'booked' as const,
        channel: formData.channel,
        notes: formData.notes || null
      };

      if (!isSupabaseConfigured) {
        // Demo mode
        const selectedPatient = patients.find(p => p.id === formData.patientId);
        const selectedClinic = clinics.find(c => c.id === formData.clinicId);
        setSuccess(`Demo: Appointment scheduled for ${selectedPatient?.first_name} ${selectedPatient?.last_name} at ${selectedClinic?.name} on ${formData.date} at ${formData.startTime}!`);
        setTimeout(() => {
          onAppointmentCreated();
          handleClose();
        }, 2000);
        return;
      }

      const { error: insertError } = await supabase
        .from('appointments')
        .insert([appointmentData]);

      if (insertError) {
        throw insertError;
      }

      setSuccess('Appointment scheduled successfully!');
      onAppointmentCreated();
      
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err: any) {
      console.error('Error creating appointment:', err);
      setError(err.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      patientId: '',
      clinicId: selectedClinic !== 'all' ? selectedClinic || '' : '',
      date: '',
      startTime: '',
      endTime: '',
      channel: 'manual',
      notes: ''
    });
    setPatientSearch('');
    setShowPatientList(false);
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  const selectedPatient = patients.find(p => p.id === formData.patientId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Schedule Appointment</h2>
                <p className="text-sm text-gray-500">Create a new appointment for a patient</p>
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
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Patient *
            </label>
            <div className="relative">
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={patientSearch}
                  onChange={(e) => {
                    setPatientSearch(e.target.value);
                    setShowPatientList(true);
                    if (!e.target.value) {
                      setFormData(prev => ({ ...prev, patientId: '' }));
                    }
                  }}
                  onFocus={() => setShowPatientList(true)}
                  className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                  placeholder="Search patients by name, phone, or email..."
                  required
                />
                <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>

              {showPatientList && filteredPatients.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => handlePatientSelect(patient)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-blue-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {patient.first_name} {patient.last_name}
                          </p>
                          <p className="text-sm text-gray-600">{patient.phone} • {patient.email}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedPatient && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">
                      {selectedPatient.first_name} {selectedPatient.last_name}
                    </p>
                    <p className="text-sm text-blue-700">{selectedPatient.phone} • {selectedPatient.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clinic Selection */}
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

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date *
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Time *
              </label>
              <div className="relative">
                <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Time *
              </label>
              <div className="relative">
                <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Channel Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Appointment Type *
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, channel: 'voice' })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.channel === 'voice'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Phone className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Phone Call</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, channel: 'web' })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.channel === 'web'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Video className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Video Call</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, channel: 'manual' })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.channel === 'manual'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <MapPin className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">In-Person</p>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors resize-none"
              placeholder="Add any notes about this appointment..."
            />
          </div>

          {/* Error/Success Messages */}
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

          {/* Form Actions */}
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
              <span>{loading ? 'Scheduling...' : 'Schedule Appointment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointmentModal;