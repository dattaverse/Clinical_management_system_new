import React from 'react';
import { Plus, Calendar, FileText, MessageSquare, Phone, Zap, X, User, Building2, Save } from 'lucide-react';
import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useClinicContext } from '../../contexts/ClinicContext';
import CreateAppointmentModal from '../Appointments/CreateAppointmentModal';

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

  React.useEffect(() => {
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

interface QuickActionsProps {
  setActiveTab: (tab: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ setActiveTab }) => {
  const { selectedClinic, clinics } = useClinicContext();
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const actions = [
    {
      title: 'New Patient',
      description: 'Add a new patient to your clinic',
      icon: Plus,
      color: 'blue',
      action: () => setShowAddPatientModal(true)
    },
    {
      title: 'Schedule Appointment',
      description: 'Book an appointment quickly',
      icon: Calendar,
      color: 'green',
      action: () => setShowScheduleModal(true)
    },
    {
      title: 'Write Prescription',
      description: 'Create and send prescription',
      icon: FileText,
      color: 'purple',
      action: () => setActiveTab('prescriptions')
    },
    {
      title: 'Send Message',
      description: 'Communicate with patients',
      icon: MessageSquare,
      color: 'orange',
      action: () => setActiveTab('communication')
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="flex items-center text-sm text-gray-600">
          <Zap className="w-4 h-4 mr-1 text-yellow-500" />
          <span>AI Powered</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          const colorClasses = getColorClasses(action.color);
          
          return (
            <button
              key={index}
              onClick={action.action}
              className={`p-4 rounded-lg bg-gradient-to-r ${colorClasses} text-white text-left transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-sm opacity-90 mt-1">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Phone className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-medium text-indigo-900">AI Voice Agent Status</h3>
            <p className="text-sm text-indigo-700">Active - Handling calls and scheduling appointments</p>
          </div>
          <div className="ml-auto">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onPatientAdded={() => {
          // Optionally refresh patient data or show success message
          setShowAddPatientModal(false);
        }}
        selectedClinicId={selectedClinic !== 'all' ? selectedClinic : null}
        clinics={clinics}
      />

      {/* Schedule Appointment Modal */}
      <CreateAppointmentModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onAppointmentCreated={() => {
          setShowScheduleModal(false);
        }}
      />
    </div>
  );
};

export default QuickActions;