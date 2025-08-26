import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Send, 
  User, 
  Calendar, 
  Building2,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useClinicContext } from '../../contexts/ClinicContext';
import type { Prescription, Patient } from '../../types';
import CreatePrescriptionModal from './CreatePrescriptionModal';
import ViewPrescriptionModal from './ViewPrescriptionModal';

const PrescriptionList: React.FC = () => {
  const { doctor } = useAuth();
  const { selectedClinic, clinics } = useClinicContext();
  const [prescriptions, setPrescriptions] = useState<(Prescription & { patient?: Patient; clinic_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);
  const [viewingPrescription, setViewingPrescription] = useState<Prescription | null>(null);
  const [sendingPdf, setSendingPdf] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [sendingSms, setSendingSms] = useState<string | null>(null);

  useEffect(() => {
    if (doctor) {
      fetchPrescriptions();
    }
  }, [doctor, selectedClinic]);

  const fetchPrescriptions = async () => {
    if (!doctor) return;

    try {
      if (!isSupabaseConfigured) {
        // Demo prescriptions data
        const demoPrescriptions = [
          {
            id: '1',
            doctor_id: doctor.id,
            clinic_id: '1',
            patient_id: '1',
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
            signed_by: doctor.name,
            signed_ts: new Date().toISOString(),
            created_at: '2024-01-15T10:00:00Z',
            patient: {
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
            clinic_name: 'Main Medical Center'
          },
          {
            id: '2',
            doctor_id: doctor.id,
            clinic_id: '1',
            patient_id: '2',
            rx_json: {
              medications: [
                {
                  name: 'Cetirizine',
                  dosage: '10mg',
                  frequency: 'Once daily',
                  duration: '14 days',
                  notes: 'Take at bedtime'
                }
              ],
              instructions: 'Avoid known allergens. Use as needed for symptoms.',
              follow_up: '1 month'
            },
            pdf_url: null,
            signed_by: doctor.name,
            signed_ts: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            created_at: '2024-01-20T14:30:00Z',
            patient: {
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
            clinic_name: 'Main Medical Center'
          }
        ];

        // Filter by selected clinic
        const filteredPrescriptions = selectedClinic && selectedClinic !== 'all'
          ? demoPrescriptions.filter(rx => rx.clinic_id === selectedClinic)
          : demoPrescriptions;

        setPrescriptions(filteredPrescriptions);
        setLoading(false);
        return;
      }

      // Fetch from database
      let query = supabase
        .from('prescriptions')
        .select(`
          *,
          patients:patient_id (
            id,
            first_name,
            last_name,
            phone,
            email,
            dob,
            sex,
            tags
          ),
          clinics:clinic_id (
            name
          )
        `)
        .eq('doctor_id', doctor.id);

      if (selectedClinic && selectedClinic !== 'all') {
        query = query.eq('clinic_id', selectedClinic);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPrescriptions = (data || []).map(rx => ({
        ...rx,
        patient: rx.patients,
        clinic_name: rx.clinics?.name
      }));

      setPrescriptions(formattedPrescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescription = (prescription: Prescription) => {
    setViewingPrescription(prescription);
    setShowViewModal(true);
  };

  const generatePrescriptionPDF = async (prescription: Prescription): Promise<string> => {
    // Simulate PDF generation - in real implementation, use jsPDF or similar
    return new Promise((resolve) => {
      setTimeout(() => {
        const pdfUrl = `https://example.com/prescriptions/${prescription.id}.pdf`;
        resolve(pdfUrl);
      }, 2000);
    });
  };

  const sendPrescriptionEmail = async (prescription: Prescription, pdfUrl: string): Promise<void> => {
    // Simulate email sending - in real implementation, call your email service
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Email sent to ${prescription.patient?.email} with PDF: ${pdfUrl}`);
        resolve();
      }, 1500);
    });
  };

  const sendPrescriptionSMS = async (prescription: Prescription): Promise<void> => {
    // Simulate SMS sending - in real implementation, call your SMS service
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`SMS sent to ${prescription.patient?.phone} for prescription: ${prescription.id}`);
        resolve();
      }, 1000);
    });
  };

  const handleDownloadPDF = async (prescription: Prescription) => {
    try {
      setSendingPdf(prescription.id);
      const pdfUrl = await generatePrescriptionPDF(prescription);
      
      // Create download link
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `prescription-${prescription.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setSendingPdf(null);
    }
  };

  const handleSendEmail = async (prescription: Prescription) => {
    try {
      setSendingEmail(prescription.id);
      const pdfUrl = await generatePrescriptionPDF(prescription);
      await sendPrescriptionEmail(prescription, pdfUrl);
      alert('Prescription sent via email successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    } finally {
      setSendingEmail(null);
    }
  };

  const handleSendSMS = async (prescription: Prescription) => {
    try {
      setSendingSms(prescription.id);
      await sendPrescriptionSMS(prescription);
      alert('Prescription notification sent via SMS successfully!');
    } catch (error) {
      console.error('Error sending SMS:', error);
      alert('Failed to send SMS');
    } finally {
      setSendingSms(null);
    }
  };

  const handleDeletePrescription = async (prescriptionId: string) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return;

    try {
      if (!isSupabaseConfigured) {
        // Demo mode
        setPrescriptions(prev => prev.filter(rx => rx.id !== prescriptionId));
        return;
      }

      const { error } = await supabase
        .from('prescriptions')
        .delete()
        .eq('id', prescriptionId);

      if (error) throw error;

      setPrescriptions(prev => prev.filter(rx => rx.id !== prescriptionId));
    } catch (error) {
      console.error('Error deleting prescription:', error);
      alert('Failed to delete prescription');
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patient && (
      `${prescription.patient.first_name} ${prescription.patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patient.phone.includes(searchTerm) ||
      prescription.rx_json.medications.some(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    return matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prescriptions...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
            <p className="text-gray-600 mt-1">
              {selectedClinic && selectedClinic !== 'all'
                ? `${filteredPrescriptions.length} prescriptions at ${clinics.find(c => c.id === selectedClinic)?.name}`
                : `${filteredPrescriptions.length} prescriptions across all clinics`
              }
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>New Prescription</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{filteredPrescriptions.length}</p>
                <p className="text-sm text-gray-600">Total Prescriptions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {prescriptions.filter(rx => {
                    const today = new Date().toDateString();
                    return new Date(rx.created_at).toDateString() === today;
                  }).length}
                </p>
                <p className="text-sm text-gray-600">Today</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {prescriptions.filter(rx => rx.pdf_url).length}
                </p>
                <p className="text-sm text-gray-600">Sent</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(prescriptions.map(rx => rx.patient_id)).size}
                </p>
                <p className="text-sm text-gray-600">Patients</p>
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
              placeholder="Search prescriptions by patient name, phone, or medication..."
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

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.map((prescription) => (
          <div key={prescription.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {prescription.patient ? 
                        `${prescription.patient.first_name} ${prescription.patient.last_name}` : 
                        'Unknown Patient'
                      }
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{prescription.patient?.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-4 h-4" />
                        <span>{prescription.clinic_name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(prescription.signed_ts)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Signed
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setSelectedPrescription(selectedPrescription === prescription.id ? null : prescription.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                    {selectedPrescription === prescription.id && (
                      <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-2 w-40">
                        <button 
                          onClick={() => {
                            handleViewPrescription(prescription);
                            setSelectedPrescription(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button 
                          onClick={() => {
                            handleDeletePrescription(prescription.id);
                            setSelectedPrescription(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Medications:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {prescription.rx_json.medications.map((medication, index) => (
                    <div key={index} className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-blue-900">{medication.name}</span>
                        <span className="text-sm text-blue-700">{medication.dosage}</span>
                      </div>
                      <div className="text-sm text-blue-600">
                        <p>{medication.frequency} • {medication.duration}</p>
                        {medication.notes && <p className="mt-1 italic">{medication.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              {prescription.rx_json.instructions && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Instructions:</h4>
                  <p className="text-sm text-gray-600">{prescription.rx_json.instructions}</p>
                </div>
              )}

              {/* Follow-up */}
              {prescription.rx_json.follow_up && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-1">Follow-up:</h4>
                  <p className="text-sm text-yellow-700">{prescription.rx_json.follow_up}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Signed by {prescription.signed_by} • Created {formatDate(prescription.created_at)}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewPrescription(prescription)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleDownloadPDF(prescription)}
                    disabled={sendingPdf === prescription.id}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 disabled:opacity-50"
                  >
                    {sendingPdf === prescription.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>{sendingPdf === prescription.id ? 'Generating...' : 'PDF'}</span>
                  </button>
                  <button 
                    onClick={() => handleSendEmail(prescription)}
                    disabled={sendingEmail === prescription.id}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1 disabled:opacity-50"
                  >
                    {sendingEmail === prescription.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    <span>{sendingEmail === prescription.id ? 'Sending...' : 'Email'}</span>
                  </button>
                  <button 
                    onClick={() => handleSendSMS(prescription)}
                    disabled={sendingSms === prescription.id}
                    className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-1 disabled:opacity-50"
                  >
                    {sendingSms === prescription.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Phone className="w-4 h-4" />
                    )}
                    <span>{sendingSms === prescription.id ? 'Sending...' : 'SMS'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPrescriptions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No prescriptions found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Try adjusting your search criteria.' 
              : 'Get started by creating your first prescription.'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg"
            >
              Create First Prescription
            </button>
          )}
        </div>
      )}

      {/* Create Prescription Modal */}
      <CreatePrescriptionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPrescriptionCreated={fetchPrescriptions}
      />

      {/* View Prescription Modal */}
      {viewingPrescription && (
        <ViewPrescriptionModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setViewingPrescription(null);
          }}
          prescription={viewingPrescription}
        />
      )}
    </div>
  );
};

export default PrescriptionList;