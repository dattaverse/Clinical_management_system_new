import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Calendar, 
  FileText, 
  Shield, 
  Activity, 
  Search, 
  Filter, 
  Plus,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  User,
  Clock,
  Tag,
  Heart,
  Thermometer,
  Weight,
  Ruler,
  Download,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Doctor, Patient, Appointment, Prescription, Clinic } from '../../types';
import DoctorDetailView from './DoctorDetailView';
import AddDoctorModal from './AddDoctorModal';
import PatientDetailModal from '../Patients/PatientDetailModal';

const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'doctors' | 'patients' | 'appointments' | 'prescriptions' | 'clinics'>('overview');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<(Patient & { doctor_name?: string; clinic_name?: string })[]>([]);
  const [appointments, setAppointments] = useState<(Appointment & { patient_name?: string; doctor_name?: string; clinic_name?: string })[]>([]);
  const [prescriptions, setPrescriptions] = useState<(Prescription & { patient_name?: string; doctor_name?: string; clinic_name?: string })[]>([]);
  const [clinics, setClinics] = useState<(Clinic & { doctor_name?: string; patient_count?: number })[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [userData, setUserData] = useState<any[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [showPatientDetail, setShowPatientDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalClinics: 0,
    totalPrescriptions: 0,
    todayAppointments: 0,
    activeDoctors: 0,
    recentPatients: 0
  });

  useEffect(() => {
    fetchAllData();
    if (activeTab === 'doctors') {
      fetchUserData();
    }
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchDoctors();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchUserData();
    }
  }, [activeTab]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDoctors(),
        fetchPatients(),
        fetchAppointments(),
        fetchPrescriptions(),
        fetchClinics()
      ]);
      calculateStats();
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      if (!isSupabaseConfigured) {
        // Enhanced demo doctors data with more realistic information
        const demoDoctors: Doctor[] = [
          { 
            id: 'demo-user-id', 
            email: 'demo@healthsphere.com', 
            name: 'Dr. Demo User', 
            country: 'US', 
            phone: '+1 (555) 123-4567', 
            timezone: 'UTC', 
            subscription_plan: 'pro', 
            ai_minutes_used: 120, 
            msg_quota_used: 432, 
            created_at: new Date().toISOString() 
          },
          { 
            id: '1', 
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
            id: '2', 
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
            id: '3', 
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
            id: '4', 
            email: 'dr.wilson@clinic.com', 
            name: 'Dr. Emma Wilson', 
            country: 'GB', 
            phone: '+44 20 7946 0958', 
            timezone: 'Europe/London', 
            subscription_plan: 'pro', 
            ai_minutes_used: 320, 
            msg_quota_used: 890, 
            created_at: '2024-02-05T16:45:00Z' 
          },
          { 
            id: '5', 
            email: 'rghatwai@gmail.com', 
            name: 'Dr. Rahul Ghatwai', 
            country: 'IN', 
            phone: '+91 98765 43210', 
            timezone: 'Asia/Kolkata', 
            subscription_plan: 'pro_plus', 
            ai_minutes_used: 650, 
            msg_quota_used: 1850, 
            created_at: '2024-01-10T08:30:00Z' 
          }
        ];
        setDoctors(demoDoctors);
        return;
      }

      // Fetch all doctors from database
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    }
  };

  const fetchPatients = async () => {
    try {
      if (!isSupabaseConfigured) {
        const demoPatients = [
          { id: '1', doctor_id: '1', clinic_id: '1', first_name: 'John', last_name: 'Smith', dob: '1985-06-15', sex: 'male' as const, phone: '+1 (555) 123-4567', email: 'john.smith@email.com', consent_flags_json: { messaging: true, marketing: false, voice_calls: true }, tags: ['diabetes', 'hypertension'], created_at: '2024-01-15T10:00:00Z', doctor_name: 'Dr. John Smith', clinic_name: 'Main Medical Center', vitals: { height: 175, weight: 80, blood_pressure: '120/80', temperature: 98.6 }, chief_complaint: 'Regular checkup' },
          { id: '2', doctor_id: '1', clinic_id: '1', first_name: 'Sarah', last_name: 'Johnson', dob: '1990-03-22', sex: 'female' as const, phone: '+1 (555) 987-6543', email: 'sarah.johnson@email.com', consent_flags_json: { messaging: true, marketing: true, voice_calls: true }, tags: ['allergies'], created_at: '2024-01-20T14:30:00Z', doctor_name: 'Dr. John Smith', clinic_name: 'Main Medical Center', vitals: { height: 165, weight: 65, blood_pressure: '110/70', temperature: 98.4 }, chief_complaint: 'Allergy consultation' },
          { id: '3', doctor_id: '2', clinic_id: '3', first_name: 'Michael', last_name: 'Davis', dob: '1978-11-10', sex: 'male' as const, phone: '+1 (555) 456-7890', email: 'michael.davis@email.com', consent_flags_json: { messaging: true, marketing: false, voice_calls: true }, tags: ['cardiac'], created_at: '2024-02-01T09:15:00Z', doctor_name: 'Dr. Sarah Johnson', clinic_name: 'Heart Specialist Center', vitals: { height: 180, weight: 85, blood_pressure: '130/85', temperature: 98.7 }, chief_complaint: 'Cardiac consultation' },
          { id: '4', doctor_id: '2', clinic_id: '3', first_name: 'Emma', last_name: 'Wilson', dob: '1992-07-25', sex: 'female' as const, phone: '+1 (555) 789-0123', email: 'emma.wilson@email.com', consent_flags_json: { messaging: true, marketing: true, voice_calls: false }, tags: ['dermatology'], created_at: '2024-02-05T16:45:00Z', doctor_name: 'Dr. Sarah Johnson', clinic_name: 'Heart Specialist Center', vitals: { height: 168, weight: 62, blood_pressure: '115/75', temperature: 98.2 }, chief_complaint: 'Skin condition' },
          { id: '5', doctor_id: '3', clinic_id: '5', first_name: 'Robert', last_name: 'Chen', dob: '1975-09-18', sex: 'male' as const, phone: '+1 (555) 321-0987', email: 'robert.chen@email.com', consent_flags_json: { messaging: true, marketing: false, voice_calls: true }, tags: ['orthopedic'], created_at: '2024-02-10T11:20:00Z', doctor_name: 'Dr. Michael Chen', clinic_name: 'Toronto General Clinic', vitals: { height: 172, weight: 78, blood_pressure: '125/82', temperature: 98.5 }, chief_complaint: 'Knee pain' },
          { id: '6', doctor_id: '4', clinic_id: '7', first_name: 'Lisa', last_name: 'Anderson', dob: '1988-12-03', sex: 'female' as const, phone: '+44 20 7946 0958', email: 'lisa.anderson@email.com', consent_flags_json: { messaging: true, marketing: true, voice_calls: true }, tags: ['pediatrics'], created_at: '2024-01-25T08:30:00Z', doctor_name: 'Dr. Emma Wilson', clinic_name: 'London Family Clinic', vitals: { height: 162, weight: 58, blood_pressure: '108/68', temperature: 98.1 }, chief_complaint: 'Child wellness check' }
        ];
        setPatients(demoPatients);
        return;
      }

      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          doctors:doctor_id (name),
          clinics:clinic_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPatients = (data || []).map(patient => ({
        ...patient,
        doctor_name: patient.doctors?.name,
        clinic_name: patient.clinics?.name
      }));

      setPatients(formattedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    }
  };

  const fetchAppointments = async () => {
    try {
      if (!isSupabaseConfigured) {
        const demoAppointments = [
          { id: '1', doctor_id: '1', clinic_id: '1', patient_id: '1', start_ts: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), end_ts: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(), status: 'booked' as const, channel: 'voice' as const, notes: 'Follow-up consultation', created_at: new Date().toISOString(), patient_name: 'John Smith', doctor_name: 'Dr. John Smith', clinic_name: 'Main Medical Center' },
          { id: '2', doctor_id: '1', clinic_id: '1', patient_id: '2', start_ts: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), end_ts: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(), status: 'booked' as const, channel: 'web' as const, notes: 'Regular checkup', created_at: new Date().toISOString(), patient_name: 'Sarah Johnson', doctor_name: 'Dr. John Smith', clinic_name: 'Main Medical Center' },
          { id: '3', doctor_id: '2', clinic_id: '3', patient_id: '3', start_ts: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), end_ts: new Date(Date.now() + 6.5 * 60 * 60 * 1000).toISOString(), status: 'complete' as const, channel: 'manual' as const, notes: 'Cardiac evaluation', created_at: new Date().toISOString(), patient_name: 'Michael Davis', doctor_name: 'Dr. Sarah Johnson', clinic_name: 'Heart Specialist Center' },
          { id: '4', doctor_id: '3', clinic_id: '5', patient_id: '5', start_ts: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), end_ts: new Date(Date.now() + 8.5 * 60 * 60 * 1000).toISOString(), status: 'booked' as const, channel: 'voice' as const, notes: 'Knee pain consultation', created_at: new Date().toISOString(), patient_name: 'Robert Chen', doctor_name: 'Dr. Michael Chen', clinic_name: 'Toronto General Clinic' }
        ];
        setAppointments(demoAppointments);
        return;
      }

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patients:patient_id (first_name, last_name),
          doctors:doctor_id (name),
          clinics:clinic_id (name)
        `)
        .order('start_ts', { ascending: true });

      if (error) throw error;

      const formattedAppointments = (data || []).map(apt => ({
        ...apt,
        patient_name: apt.patients ? `${apt.patients.first_name} ${apt.patients.last_name}` : 'Unknown',
        doctor_name: apt.doctors?.name,
        clinic_name: apt.clinics?.name
      }));

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      if (!isSupabaseConfigured) {
        const demoPrescriptions = [
          { id: '1', doctor_id: '1', clinic_id: '1', patient_id: '1', rx_json: { medications: [{ name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days', notes: 'Take with meals' }], instructions: 'Monitor blood sugar levels', follow_up: '2 weeks' }, pdf_url: null, signed_by: 'Dr. John Smith', signed_ts: new Date().toISOString(), created_at: '2024-01-15T10:00:00Z', patient_name: 'John Smith', doctor_name: 'Dr. John Smith', clinic_name: 'Main Medical Center' },
          { id: '2', doctor_id: '2', clinic_id: '3', patient_id: '3', rx_json: { medications: [{ name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', notes: 'Take in morning' }], instructions: 'Monitor blood pressure', follow_up: '1 month' }, pdf_url: null, signed_by: 'Dr. Sarah Johnson', signed_ts: new Date().toISOString(), created_at: '2024-02-01T14:30:00Z', patient_name: 'Michael Davis', doctor_name: 'Dr. Sarah Johnson', clinic_name: 'Heart Specialist Center' }
        ];
        setPrescriptions(demoPrescriptions);
        return;
      }

      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          patients:patient_id (first_name, last_name),
          doctors:doctor_id (name),
          clinics:clinic_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPrescriptions = (data || []).map(rx => ({
        ...rx,
        patient_name: rx.patients ? `${rx.patients.first_name} ${rx.patients.last_name}` : 'Unknown',
        doctor_name: rx.doctors?.name,
        clinic_name: rx.clinics?.name
      }));

      setPrescriptions(formattedPrescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setPrescriptions([]);
    }
  };

  const fetchClinics = async () => {
    try {
      if (!isSupabaseConfigured) {
        const demoClinics = [
          { id: '1', doctor_id: '1', name: 'Main Medical Center', address: '123 Health St', city: 'New York', state: 'NY', country: 'US', phone: '+1 (555) 123-4567', hours_json: { monday: { open: '09:00', close: '17:00' }, tuesday: { open: '09:00', close: '17:00' }, wednesday: { open: '09:00', close: '17:00' }, thursday: { open: '09:00', close: '17:00' }, friday: { open: '09:00', close: '17:00' }, saturday: { open: '09:00', close: '13:00' }, sunday: { open: 'closed', close: 'closed' } }, created_at: '2024-01-15T10:00:00Z', doctor_name: 'Dr. John Smith', patient_count: 2 },
          { id: '2', doctor_id: '1', name: 'Downtown Clinic', address: '456 Medical Ave', city: 'New York', state: 'NY', country: 'US', phone: '+1 (555) 987-6543', hours_json: { monday: { open: '08:00', close: '18:00' }, tuesday: { open: '08:00', close: '18:00' }, wednesday: { open: '08:00', close: '18:00' }, thursday: { open: '08:00', close: '18:00' }, friday: { open: '08:00', close: '16:00' }, saturday: { open: 'closed', close: 'closed' }, sunday: { open: 'closed', close: 'closed' } }, created_at: '2024-02-01T10:00:00Z', doctor_name: 'Dr. John Smith', patient_count: 0 },
          { id: '3', doctor_id: '2', name: 'Heart Specialist Center', address: '789 Cardiac Blvd', city: 'Los Angeles', state: 'CA', country: 'US', phone: '+1 (555) 456-7890', hours_json: { monday: { open: '07:00', close: '19:00' }, tuesday: { open: '07:00', close: '19:00' }, wednesday: { open: '07:00', close: '19:00' }, thursday: { open: '07:00', close: '19:00' }, friday: { open: '07:00', close: '17:00' }, saturday: { open: '08:00', close: '14:00' }, sunday: { open: 'closed', close: 'closed' } }, created_at: '2024-01-20T11:00:00Z', doctor_name: 'Dr. Sarah Johnson', patient_count: 2 },
          { id: '4', doctor_id: '2', name: 'West Coast Medical', address: '321 Health Plaza', city: 'Los Angeles', state: 'CA', country: 'US', phone: '+1 (555) 789-0123', hours_json: { monday: { open: '09:00', close: '17:00' }, tuesday: { open: '09:00', close: '17:00' }, wednesday: { open: '09:00', close: '17:00' }, thursday: { open: '09:00', close: '17:00' }, friday: { open: '09:00', close: '17:00' }, saturday: { open: 'closed', close: 'closed' }, sunday: { open: 'closed', close: 'closed' } }, created_at: '2024-02-15T09:00:00Z', doctor_name: 'Dr. Sarah Johnson', patient_count: 0 },
          { id: '5', doctor_id: '3', name: 'Toronto General Clinic', address: '555 Medical Dr', city: 'Toronto', state: 'ON', country: 'CA', phone: '+1 (416) 555-0123', hours_json: { monday: { open: '08:00', close: '18:00' }, tuesday: { open: '08:00', close: '18:00' }, wednesday: { open: '08:00', close: '18:00' }, thursday: { open: '08:00', close: '18:00' }, friday: { open: '08:00', close: '16:00' }, saturday: { open: '09:00', close: '13:00' }, sunday: { open: 'closed', close: 'closed' } }, created_at: '2024-03-01T12:00:00Z', doctor_name: 'Dr. Michael Chen', patient_count: 1 },
          { id: '6', doctor_id: '3', name: 'North York Medical', address: '777 Wellness Way', city: 'Toronto', state: 'ON', country: 'CA', phone: '+1 (416) 555-9876', hours_json: { monday: { open: '09:00', close: '17:00' }, tuesday: { open: '09:00', close: '17:00' }, wednesday: { open: '09:00', close: '17:00' }, thursday: { open: '09:00', close: '17:00' }, friday: { open: '09:00', close: '17:00' }, saturday: { open: 'closed', close: 'closed' }, sunday: { open: 'closed', close: 'closed' } }, created_at: '2024-03-05T10:30:00Z', doctor_name: 'Dr. Michael Chen', patient_count: 0 },
          { id: '7', doctor_id: '4', name: 'London Family Clinic', address: '123 Harley Street', city: 'London', state: 'England', country: 'GB', phone: '+44 20 7946 0958', hours_json: { monday: { open: '08:00', close: '18:00' }, tuesday: { open: '08:00', close: '18:00' }, wednesday: { open: '08:00', close: '18:00' }, thursday: { open: '08:00', close: '18:00' }, friday: { open: '08:00', close: '16:00' }, saturday: { open: '09:00', close: '13:00' }, sunday: { open: 'closed', close: 'closed' } }, created_at: '2024-02-10T14:00:00Z', doctor_name: 'Dr. Emma Wilson', patient_count: 1 }
        ];
        setClinics(demoClinics);
        return;
      }

      const { data, error } = await supabase
        .from('clinics')
        .select(`
          *,
          doctors:doctor_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedClinics = (data || []).map(clinic => ({
        ...clinic,
        doctor_name: clinic.doctors?.name,
        patient_count: patients.filter(p => p.clinic_id === clinic.id).length
      }));

      setClinics(formattedClinics);
    } catch (error) {
      console.error('Error fetching clinics:', error);
      setClinics([]);
    }
  };

  const calculateStats = () => {
    const today = new Date().toDateString();
    const todayAppointments = appointments.filter(apt => 
      new Date(apt.start_ts).toDateString() === today
    ).length;
    
    const recentPatients = patients.filter(patient => {
      const createdDate = new Date(patient.created_at);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return createdDate >= thirtyDaysAgo;
    }).length;

    setStats({
      totalDoctors: doctors.length,
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      totalClinics: clinics.length,
      totalPrescriptions: prescriptions.length,
      todayAppointments,
      activeDoctors: doctors.filter(d => d.subscription_plan !== 'starter').length,
      recentPatients
    });
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPatientDetail(true);
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro_plus':
        return 'bg-purple-100 text-purple-800';
      case 'pro':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAge = (dob: string) => {
    return new Date().getFullYear() - new Date(dob).getFullYear();
  };

  if (selectedDoctor) {
    return (
      <DoctorDetailView 
        doctor={selectedDoctor} 
        onBack={() => setSelectedDoctor(null)} 
      />
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Admin Dashboard</h1>
        <p className="text-gray-600">Comprehensive system overview and management</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'doctors', label: 'Doctors', icon: Users },
              { id: 'patients', label: 'Patients', icon: User },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
              { id: 'clinics', label: 'Clinics', icon: Building2 }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeView === tab.id
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

      {/* Overview Tab */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalDoctors}</p>
                  <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                  <p className="text-xs text-green-600 mt-1">{stats.activeDoctors} active</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-xs text-green-600 mt-1">+{stats.recentPatients} this month</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <User className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</p>
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-xs text-blue-600 mt-1">{stats.todayAppointments} today</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalClinics}</p>
                  <p className="text-sm font-medium text-gray-600">Total Clinics</p>
                  <p className="text-xs text-orange-600 mt-1">{stats.totalPrescriptions} prescriptions</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Building2 className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Patients</h3>
              <div className="space-y-3">
                {patients.slice(0, 5).map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => handlePatientClick(patient)}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient.first_name} {patient.last_name}</p>
                        <p className="text-sm text-gray-600">{patient.doctor_name}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(patient.created_at)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h3>
              <div className="space-y-3">
                {appointments.filter(apt => new Date(apt.start_ts).toDateString() === new Date().toDateString()).slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patient_name}</p>
                        <p className="text-sm text-gray-600">{appointment.doctor_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{new Date(appointment.start_ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctors Tab */}
      {activeView === 'doctors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">All Doctors ({doctors.length})</h2>
              <p className="text-gray-600 mt-1">Manage doctor accounts and monitor system usage</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Doctor</span>
            </button>
          </div>

          {/* Search and Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center justify-between">
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
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">{stats.activeDoctors} Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">{doctors.filter(d => d.subscription_plan === 'starter').length} Starter</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">{doctors.filter(d => d.subscription_plan === 'pro_plus').length} Pro Plus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {doctors.filter(doctor => 
              doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              doctor.phone.includes(searchTerm)
            ).map((doctor) => (
              <div 
                key={doctor.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-500">{doctor.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" title="Active"></div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(doctor.subscription_plan)}`}>
                        {doctor.subscription_plan.replace('_', ' ').toUpperCase()}
                      </span>
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
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Joined {formatDate(doctor.created_at)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">AI Minutes</span>
                      </div>
                      <p className="text-lg font-bold text-blue-900 mt-1">{doctor.ai_minutes_used}</p>
                      <p className="text-xs text-blue-600">
                        {doctor.subscription_plan === 'starter' ? '/ 100' : 
                         doctor.subscription_plan === 'pro' ? '/ 500' : '/ 1000'} monthly
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Messages</span>
                      </div>
                      <p className="text-lg font-bold text-green-900 mt-1">{doctor.msg_quota_used}</p>
                      <p className="text-xs text-green-600">
                        {doctor.subscription_plan === 'starter' ? '/ 1000' : 
                         doctor.subscription_plan === 'pro' ? '/ 5000' : '/ 10000'} monthly
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">Clinics</span>
                      </div>
                      <p className="text-lg font-bold text-purple-900 mt-1">
                        {clinics.filter(c => c.doctor_id === doctor.id).length}
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-900">Patients</span>
                      </div>
                      <p className="text-lg font-bold text-orange-900 mt-1">
                        {patients.filter(p => p.doctor_id === doctor.id).length}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDoctor(doctor);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {doctors.filter(doctor => 
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.phone.includes(searchTerm)
          ).length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search criteria.' 
                  : 'Get started by adding your first doctor to the system.'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
                >
                  Add Your First Doctor
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Patients Tab */}
      {activeView === 'patients' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">All Patients ({patients.length})</h2>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {patients.filter(patient =>
              `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
              patient.phone.includes(searchTerm) ||
              patient.email.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((patient) => (
              <div key={patient.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => handlePatientClick(patient)}>
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
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{patient.doctor_name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm">{patient.clinic_name}</span>
                    </div>
                  </div>

                  {patient.tags && patient.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {patient.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointments Tab */}
      {activeView === 'appointments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">All Appointments ({appointments.length})</h2>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>

          <div className="space-y-4">
            {appointments.filter(appointment =>
              appointment.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              appointment.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              appointment.clinic_name?.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{appointment.patient_name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{appointment.doctor_name}</span>
                          <span>{appointment.clinic_name}</span>
                          <span className="capitalize">{appointment.channel}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-900">Date & Time</p>
                      <p className="text-blue-800">{formatDateTime(appointment.start_ts)}</p>
                    </div>
                    {appointment.notes && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-900">Notes</p>
                        <p className="text-gray-700 text-sm">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prescriptions Tab */}
      {activeView === 'prescriptions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">All Prescriptions ({prescriptions.length})</h2>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>

          <div className="space-y-4">
            {prescriptions.filter(prescription =>
              prescription.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              prescription.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              prescription.rx_json.medications.some(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()))
            ).map((prescription) => (
              <div key={prescription.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{prescription.patient_name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{prescription.doctor_name}</span>
                          <span>{prescription.clinic_name}</span>
                          <span>{formatDateTime(prescription.signed_ts)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Signed
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Medications:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {prescription.rx_json.medications.slice(0, 4).map((medication, index) => (
                        <div key={index} className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-blue-900">{medication.name}</span>
                            <span className="text-sm text-blue-700">{medication.dosage}</span>
                          </div>
                          <p className="text-sm text-blue-600">{medication.frequency}</p>
                        </div>
                      ))}
                      {prescription.rx_json.medications.length > 4 && (
                        <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center">
                          <span className="text-sm text-gray-600">+{prescription.rx_json.medications.length - 4} more</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Signed by {prescription.signed_by}
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clinics Tab */}
      {activeView === 'clinics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">All Clinics ({clinics.length})</h2>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clinics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {clinics.filter(clinic =>
              clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              clinic.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
              clinic.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((clinic) => (
              <div key={clinic.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
                        <p className="text-sm text-gray-500">{clinic.doctor_name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{clinic.address}, {clinic.city}, {clinic.state}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{clinic.phone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Patients</span>
                      </div>
                      <p className="text-xl font-bold text-blue-900 mt-1">{clinic.patient_count || 0}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Created</span>
                      </div>
                      <p className="text-sm font-bold text-green-900 mt-1">{formatDate(clinic.created_at)}</p>
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      <AddDoctorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onDoctorAdded={() => {
          fetchDoctors();
          calculateStats();
        }}
      />

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          isOpen={showPatientDetail}
          onClose={() => {
            setShowPatientDetail(false);
            setSelectedPatient(null);
          }}
          patient={selectedPatient}
          onPatientUpdated={() => {
            fetchPatients();
            calculateStats();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;