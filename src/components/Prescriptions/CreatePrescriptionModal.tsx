import React, { useState, useEffect } from 'react';
import { X, FileText, User, Search, Building2, Plus, Trash2, Save, Send, Mail, Phone } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useClinicContext } from '../../contexts/ClinicContext';
import type { Patient } from '../../types';

interface CreatePrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrescriptionCreated: () => void;
  preselectedPatient?: Patient | null;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

const CreatePrescriptionModal: React.FC<CreatePrescriptionModalProps> = ({ 
  isOpen, 
  onClose, 
  onPrescriptionCreated,
  preselectedPatient = null
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
  const [sendingPdf, setSendingPdf] = useState(false);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState<Patient | null>(null);

  const [formData, setFormData] = useState({
    patientId: preselectedPatient?.id || '',
    clinicId: selectedClinic !== 'all' ? selectedClinic || '' : '',
    medications: [
      { name: '', dosage: '', frequency: '', duration: '', notes: '' }
    ] as Medication[],
    instructions: '',
    followUp: '',
    sendEmail: true,
    sendSms: false
  });

  useEffect(() => {
    if (isOpen && doctor) {
      fetchPatients();
      if (preselectedPatient) {
        setPatientSearch(`${preselectedPatient.first_name} ${preselectedPatient.last_name}`);
        setFormData(prev => ({ ...prev, patientId: preselectedPatient.id }));
      }
    }
  }, [isOpen, doctor, preselectedPatient]);

  useEffect(() => {
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
          }
        ];
        setPatients(demoPatients);
        setFilteredPatients(demoPatients);
        return;
      }

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

  const handlePatientSelect = (patient: Patient) => {
    setFormData(prev => ({ ...prev, patientId: patient.id }));
    setPatientSearch(`${patient.first_name} ${patient.last_name}`);
    setShowPatientList(false);
    setSelectedPatientDetails(patient);
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '', notes: '' }]
    }));
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const generatePrescriptionPDF = async (prescriptionData: any, patient: Patient) => {
    // In a real implementation, you would use a PDF generation library like jsPDF or react-pdf
    // For demo purposes, we'll simulate PDF generation
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const pdfUrl = `https://example.com/prescriptions/${prescriptionData.id}.pdf`;
        resolve(pdfUrl);
      }, 1000);
    });
  };

  const sendPrescriptionEmail = async (patient: Patient, pdfUrl: string) => {
    // In a real implementation, you would call your email service API
    // For demo purposes, we'll simulate email sending
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(`Email sent to ${patient.email} with PDF: ${pdfUrl}`);
        resolve();
      }, 500);
    });
  };

  const sendPrescriptionSMS = async (patient: Patient, prescriptionId: string) => {
    // In a real implementation, you would call your SMS service API
    // For demo purposes, we'll simulate SMS sending
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(`SMS sent to ${patient.phone} for prescription: ${prescriptionId}`);
        resolve();
      }, 500);
    });
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

      if (formData.medications.some(med => !med.name || !med.dosage || !med.frequency)) {
        throw new Error('Please fill in all required medication fields');
      }

      const selectedPatient = patients.find(p => p.id === formData.patientId);
      if (!selectedPatient) {
        throw new Error('Selected patient not found');
      }

      const prescriptionData = {
        doctor_id: doctor.id,
        clinic_id: formData.clinicId,
        patient_id: formData.patientId,
        rx_json: {
          medications: formData.medications.filter(med => med.name),
          instructions: formData.instructions,
          follow_up: formData.followUp
        },
        signed_by: doctor.name,
        signed_ts: new Date().toISOString()
      };

      let prescriptionId = '';

      if (!isSupabaseConfigured) {
        // Demo mode
        prescriptionId = `demo-rx-${Date.now()}`;
        setSuccess('Demo: Prescription created successfully!');
      } else {
        const { data, error: insertError } = await supabase
          .from('prescriptions')
          .insert([prescriptionData])
          .select()
          .single();

        if (insertError) throw insertError;
        prescriptionId = data.id;
        setSuccess('Prescription created successfully!');
      }

      // Generate PDF and send communications
      if (formData.sendEmail || formData.sendSms) {
        setSendingPdf(true);
        
        try {
          // Generate PDF
          const pdfUrl = await generatePrescriptionPDF({ ...prescriptionData, id: prescriptionId }, selectedPatient);
          
          // Send email if requested
          if (formData.sendEmail && selectedPatient.consent_flags_json.messaging) {
            await sendPrescriptionEmail(selectedPatient, pdfUrl);
          }
          
          // Send SMS if requested
          if (formData.sendSms && selectedPatient.consent_flags_json.messaging) {
            await sendPrescriptionSMS(selectedPatient, prescriptionId);
          }
          
          setSuccess(prev => prev + ' PDF generated and sent successfully!');
        } catch (commError) {
          console.error('Communication error:', commError);
          setSuccess(prev => prev + ' (Note: Communication sending failed)');
        } finally {
          setSendingPdf(false);
        }
      }

      onPrescriptionCreated();
      
      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (err: any) {
      console.error('Error creating prescription:', err);
      setError(err.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      patientId: preselectedPatient?.id || '',
      clinicId: selectedClinic !== 'all' ? selectedClinic || '' : '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }],
      instructions: '',
      followUp: '',
      sendEmail: true,
      sendSms: false
    });
    setPatientSearch(preselectedPatient ? `${preselectedPatient.first_name} ${preselectedPatient.last_name}` : '');
    setShowPatientList(false);
    setError('');
    setSuccess('');
    setSendingPdf(false);
    onClose();
  };

  if (!isOpen) return null;

  const selectedPatient = patients.find(p => p.id === formData.patientId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create Prescription</h2>
                <p className="text-sm text-gray-500">Write and send a new prescription</p>
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
          {!preselectedPatient && (
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
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
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
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-green-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-green-600" />
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
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900">
                        {selectedPatient.first_name} {selectedPatient.last_name}
                      </p>
                      <p className="text-sm text-green-700">{selectedPatient.phone} • {selectedPatient.email}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedPatient.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {preselectedPatient && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">
                    Prescription for: {preselectedPatient.first_name} {preselectedPatient.last_name}
                  </p>
                  <p className="text-sm text-green-700">{preselectedPatient.phone} • {preselectedPatient.email}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {preselectedPatient.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors appearance-none"
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

          {/* Medications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Medications *
              </label>
              <button
                type="button"
                onClick={addMedication}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-1 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medication</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.medications.map((medication, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
                    {formData.medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Medication Name *
                      </label>
                      <input
                        type="text"
                        value={medication.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="e.g., Metformin"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Dosage *
                      </label>
                      <input
                        type="text"
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="e.g., 500mg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Frequency *
                      </label>
                      <input
                        type="text"
                        value={medication.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="e.g., Twice daily"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={medication.duration}
                        onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="e.g., 30 days"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <input
                        type="text"
                        value={medication.notes}
                        onChange={(e) => updateMedication(index, 'notes', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="e.g., Take with meals"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors resize-none"
              placeholder="Additional instructions for the patient..."
            />
          </div>

          {/* Follow-up */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Follow-up
            </label>
            <input
              type="text"
              value={formData.followUp}
              onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              placeholder="e.g., 2 weeks, 1 month"
            />
          </div>

          {/* Communication Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Send Prescription
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={formData.sendEmail}
                  onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="sendEmail" className="flex items-center space-x-2 text-sm text-gray-700">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Send PDF via Email</span>
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="sendSms"
                  checked={formData.sendSms}
                  onChange={(e) => setFormData({ ...formData, sendSms: e.target.checked })}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="sendSms" className="flex items-center space-x-2 text-sm text-gray-700">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span>Send notification via SMS</span>
                </label>
              </div>
            </div>
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
              {sendingPdf && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-green-700 text-xs">Generating PDF and sending...</span>
                </div>
              )}
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
              disabled={loading || sendingPdf}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Creating...' : sendingPdf ? 'Sending...' : 'Create & Send Prescription'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePrescriptionModal;