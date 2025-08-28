import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Video,
  Building2
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useClinicContext } from '../../contexts/ClinicContext';
import type { Appointment, Patient } from '../../types';
import CreateAppointmentModal from './CreateAppointmentModal';
import EditAppointmentModal from './EditAppointmentModal';

const AppointmentList: React.FC = () => {
  const { doctor } = useAuth();
  const { selectedClinic, clinics } = useClinicContext();
  const [appointments, setAppointments] = useState<(Appointment & { patient?: Patient; clinic_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (doctor) {
      fetchAppointments();
    }
  }, [doctor, selectedClinic]);

  const fetchAppointments = async () => {
    if (!doctor) return;

    try {
      if (!isSupabaseConfigured) {
        // Demo data with more comprehensive appointments
        const demoAppointments = [
          {
            id: '1',
            doctor_id: doctor.id,
            clinic_id: '1',
            patient_id: '1',
            start_ts: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            end_ts: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
            status: 'booked' as const,
            channel: 'voice' as const,
            notes: 'Follow-up consultation for diabetes management',
            created_at: new Date().toISOString(),
            patient: {
              id: '1',
              doctor_id: doctor.id,
              clinic_id: '1',
              first_name: 'John',
              last_name: 'Smith',
              dob: '1985-06-15',
              sex: 'male' as const,
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
            start_ts: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            end_ts: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(),
            status: 'booked' as const,
            channel: 'web' as const,
            notes: 'Regular checkup and blood pressure monitoring',
            created_at: new Date().toISOString(),
            patient: {
              id: '2',
              doctor_id: doctor.id,
              clinic_id: '1',
              first_name: 'Sarah',
              last_name: 'Johnson',
              dob: '1990-03-22',
              sex: 'female' as const,
              phone: '+1 (555) 987-6543',
              email: 'sarah.johnson@email.com',
              consent_flags_json: { messaging: true, marketing: true, voice_calls: true },
              tags: ['allergies'],
              created_at: '2024-01-20T14:30:00Z'
            },
            clinic_name: 'Main Medical Center'
          },
          {
            id: '3',
            doctor_id: doctor.id,
            clinic_id: '2',
            patient_id: '3',
            start_ts: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            end_ts: new Date(Date.now() + 6.5 * 60 * 60 * 1000).toISOString(),
            status: 'complete' as const,
            channel: 'manual' as const,
            notes: 'New patient consultation - cardiac evaluation',
            created_at: new Date().toISOString(),
            patient: {
              id: '3',
              doctor_id: doctor.id,
              clinic_id: '2',
              first_name: 'Michael',
              last_name: 'Davis',
              dob: '1978-11-10',
              sex: 'male' as const,
              phone: '+1 (555) 456-7890',
              email: 'michael.davis@email.com',
              consent_flags_json: { messaging: true, marketing: false, voice_calls: true },
              tags: ['cardiac'],
              created_at: '2024-02-01T09:15:00Z'
            },
            clinic_name: 'Downtown Clinic'
          },
          {
            id: '4',
            doctor_id: doctor.id,
            clinic_id: '1',
            patient_id: '4',
            start_ts: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            end_ts: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
            status: 'cancelled' as const,
            channel: 'voice' as const,
            notes: 'Patient cancelled due to emergency',
            created_at: new Date().toISOString(),
            patient: {
              id: '4',
              doctor_id: doctor.id,
              clinic_id: '1',
              first_name: 'Emma',
              last_name: 'Wilson',
              dob: '1992-07-25',
              sex: 'female' as const,
              phone: '+1 (555) 789-0123',
              email: 'emma.wilson@email.com',
              consent_flags_json: { messaging: true, marketing: true, voice_calls: false },
              tags: ['dermatology'],
              created_at: '2024-02-05T16:45:00Z'
            },
            clinic_name: 'Main Medical Center'
          }
        ];

        // Filter by selected clinic
        const filteredAppointments = selectedClinic && selectedClinic !== 'all'
          ? demoAppointments.filter(apt => apt.clinic_id === selectedClinic)
          : demoAppointments;

        setAppointments(filteredAppointments);
        setLoading(false);
        return;
      }

      // Fetch from database
      let query = supabase
        .from('appointments')
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

      const { data, error } = await query.order('start_ts', { ascending: true });

      if (error) throw error;

      const formattedAppointments = (data || []).map(apt => ({
        ...apt,
        patient: apt.patients,
        clinic_name: apt.clinics?.name
      }));

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      if (!isSupabaseConfigured) {
        // Demo mode
        setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
        return;
      }

      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;

      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment');
    }
  };

  const handleStartAppointment = async (appointment: Appointment) => {
    try {
      if (!isSupabaseConfigured) {
        // Demo mode - just update local state
        setAppointments(prev => prev.map(apt => 
          apt.id === appointment.id 
            ? { ...apt, status: 'complete' }
            : apt
        ));
        alert('Demo: Appointment marked as complete!');
        return;
      }

      // Update appointment status to complete
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'complete',
          notes: appointment.notes ? `${appointment.notes} | Completed on ${new Date().toLocaleString()}` : `Completed on ${new Date().toLocaleString()}`
        })
        .eq('id', appointment.id);

      if (error) throw error;

      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt.id === appointment.id 
          ? { ...apt, status: 'complete' }
          : apt
      ));

      alert('Appointment marked as complete successfully!');
    } catch (error) {
      console.error('Error completing appointment:', error);
      alert('Failed to mark appointment as complete');
    }
  };
  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowEditModal(true);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient && (
      `${appointment.patient.first_name} ${appointment.patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient.phone.includes(searchTerm) ||
      appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'booked':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'no_show':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'voice':
        return <Phone className="w-4 h-4" />;
      case 'web':
        return <Video className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">
              {selectedClinic && selectedClinic !== 'all'
                ? `${filteredAppointments.length} appointments at ${clinics.find(c => c.id === selectedClinic)?.name}`
                : `${filteredAppointments.length} appointments across all clinics`
              }
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Schedule Appointment</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'booked').length}
                </p>
                <p className="text-sm text-gray-600">Scheduled</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'complete').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'cancelled').length}
                </p>
                <p className="text-sm text-gray-600">Cancelled</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'no_show').length}
                </p>
                <p className="text-sm text-gray-600">No Show</p>
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
              placeholder="Search appointments by patient name, phone, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
          >
            <option value="all">All Status</option>
            <option value="booked">Scheduled</option>
            <option value="complete">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
          <button className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2 font-medium">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => {
          const startTime = formatDateTime(appointment.start_ts);
          const endTime = formatDateTime(appointment.end_ts);

          return (
            <div key={appointment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {appointment.patient ? 
                          `${appointment.patient.first_name} ${appointment.patient.last_name}` : 
                          'Unknown Patient'
                        }
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{appointment.patient?.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{appointment.clinic_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      <span className="capitalize">{appointment.status.replace('_', ' ')}</span>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setSelectedAppointment(selectedAppointment === appointment.id ? null : appointment.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      {selectedAppointment === appointment.id && (
                        <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-2 w-40">
                          <button 
                            onClick={() => {
                              handleEditAppointment(appointment);
                              setSelectedAppointment(null);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => {
                              handleDeleteAppointment(appointment.id);
                              setSelectedAppointment(null);
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Date & Time</span>
                    </div>
                    <p className="text-blue-800 font-semibold">{startTime.date}</p>
                    <p className="text-blue-600 text-sm">{startTime.time} - {endTime.time}</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      {getChannelIcon(appointment.channel)}
                      <span className="text-sm font-medium text-green-900">Channel</span>
                    </div>
                    <p className="text-green-800 font-semibold capitalize">{appointment.channel}</p>
                    <p className="text-green-600 text-sm">
                      {appointment.channel === 'voice' ? 'Phone Call' : 
                       appointment.channel === 'web' ? 'Video Call' : 'In-Person'}
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Building2 className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Location</span>
                    </div>
                    <p className="text-purple-800 font-semibold">{appointment.clinic_name}</p>
                    <p className="text-purple-600 text-sm">Clinic Location</p>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Notes:</span> {appointment.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Created {new Date(appointment.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    {appointment.status === 'booked' && (
                      <>
                        <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                          Start Appointment
                        </button>
                        <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors">
                          Reschedule
                        </button>
                      </>
                    )}
                    <button className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search criteria or filters.' 
              : 'Get started by scheduling your first appointment.'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
            >
              Schedule First Appointment
            </button>
          )}
        </div>
      )}

      {/* Create Appointment Modal */}
      <CreateAppointmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onAppointmentCreated={fetchAppointments}
      />

      {/* Edit Appointment Modal */}
      {editingAppointment && (
        <EditAppointmentModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingAppointment(null);
          }}
          appointment={editingAppointment}
          onAppointmentUpdated={fetchAppointments}
        />
      )}
    </div>
  );
};

export default AppointmentList;