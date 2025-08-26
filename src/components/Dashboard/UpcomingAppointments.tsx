import React from 'react';
import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Video, MapPin } from 'lucide-react';
import type { Appointment } from '../../types';
import { useClinicContext } from '../../contexts/ClinicContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const UpcomingAppointments: React.FC = () => {
  const { selectedClinic, clinics } = useClinicContext();
  const { doctor } = useAuth();
  const [appointments, setAppointments] = useState<(Appointment & { patient_name: string; clinic_name: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctor) {
      fetchUpcomingAppointments();
    }
  }, [doctor, selectedClinic]);

  const fetchUpcomingAppointments = async () => {
    if (!doctor) return;

    try {
      if (!isSupabaseConfigured) {
        // Use demo data for non-configured environments
        const demoAppointments = getAllAppointments();
        const filteredAppointments = selectedClinic && selectedClinic !== 'all'
          ? demoAppointments.filter(apt => apt.clinic_id === selectedClinic)
          : demoAppointments;
        setAppointments(filteredAppointments);
        setLoading(false);
        return;
      }

      // Fetch real upcoming appointments from database
      const now = new Date().toISOString();
      
      let query = supabase
        .from('appointments')
        .select(`
          *,
          patients:patient_id (
            first_name,
            last_name
          ),
          clinics:clinic_id (
            name
          )
        `)
        .eq('doctor_id', doctor.id)
        .eq('status', 'booked')
        .gte('start_ts', now)
        .order('start_ts', { ascending: true })
        .limit(5);

      if (selectedClinic && selectedClinic !== 'all') {
        query = query.eq('clinic_id', selectedClinic);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedAppointments = (data || []).map(apt => ({
        ...apt,
        patient_name: apt.patients ? `${apt.patients.first_name} ${apt.patients.last_name}` : 'Unknown Patient',
        clinic_name: apt.clinics?.name || 'Unknown Clinic'
      }));

      setAppointments(formattedAppointments);

    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      // Fallback to demo data on error
      const demoAppointments = getAllAppointments();
      const filteredAppointments = selectedClinic && selectedClinic !== 'all'
        ? demoAppointments.filter(apt => apt.clinic_id === selectedClinic)
        : demoAppointments;
      setAppointments(filteredAppointments);
    } finally {
      setLoading(false);
    }
  };

  // Mock data with more appointments across different clinics
  const getAllAppointments = (): (Appointment & { patient_name: string; clinic_name: string })[] => [
    {
      id: '1',
      doctor_id: '1',
      clinic_id: '1',
      patient_id: '1',
      start_ts: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      end_ts: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
      status: 'booked',
      channel: 'voice',
      notes: 'Follow-up consultation',
      patient_name: 'John Smith',
      clinic_name: 'Main Medical Center'
    },
    {
      id: '2',
      doctor_id: '1',
      clinic_id: '1',
      patient_id: '2',
      start_ts: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
      end_ts: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(),
      status: 'booked',
      channel: 'web',
      notes: 'Regular checkup',
      patient_name: 'Sarah Johnson',
      clinic_name: 'Main Medical Center'
    },
    {
      id: '3',
      doctor_id: '1',
      clinic_id: '2',
      patient_id: '3',
      start_ts: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
      end_ts: new Date(Date.now() + 6.5 * 60 * 60 * 1000).toISOString(),
      status: 'booked',
      channel: 'manual',
      notes: 'New patient consultation',
      patient_name: 'Mike Davis',
      clinic_name: 'Downtown Clinic'
    },
    {
      id: '4',
      doctor_id: '1',
      clinic_id: '1',
      patient_id: '4',
      start_ts: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
      end_ts: new Date(Date.now() + 8.5 * 60 * 60 * 1000).toISOString(),
      status: 'booked',
      channel: 'voice',
      notes: 'Follow-up appointment',
      patient_name: 'Emma Wilson',
      clinic_name: 'Main Medical Center'
    },
    {
      id: '5',
      doctor_id: '1',
      clinic_id: '2',
      patient_id: '5',
      start_ts: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(), // 10 hours from now
      end_ts: new Date(Date.now() + 10.5 * 60 * 60 * 1000).toISOString(),
      status: 'booked',
      channel: 'web',
      notes: 'Consultation',
      patient_name: 'Robert Johnson',
      clinic_name: 'Downtown Clinic'
    }
  ];


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

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'voice':
        return 'bg-green-100 text-green-800';
      case 'web':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
        {loading && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        )}
        {selectedClinic && (
          <div className="text-sm text-blue-600 font-medium">
            {clinics.find(c => c.id === selectedClinic)?.name} ({appointments.length})
          </div>
        )}
        {!selectedClinic && (
          <div className="text-sm text-gray-600">
            All Clinics ({appointments.length})
          </div>
        )}
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Schedule
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      ) : (
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{appointment.patient_name}</h3>
                  <p className="text-sm text-gray-600">{appointment.notes}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getChannelColor(appointment.channel)}`}>
                {getChannelIcon(appointment.channel)}
                <span className="capitalize">{appointment.channel}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(appointment.start_ts)} - {formatTime(appointment.end_ts)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{appointment.clinic_name}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors">
                  Start
                </button>
                <button className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Full Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingAppointments;