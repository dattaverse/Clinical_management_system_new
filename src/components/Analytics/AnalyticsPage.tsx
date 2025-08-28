import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Phone, 
  MessageSquare,
  Clock,
  Activity,
  Building2,
  FileText,
  Heart,
  Filter,
  Download,
  RefreshCw,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useClinicContext } from '../../contexts/ClinicContext';

const AnalyticsPage: React.FC = () => {
  const { doctor, isAdmin } = useAuth();
  const { selectedClinic, clinics } = useClinicContext();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');

  const [analytics, setAnalytics] = useState({
    overview: {
      totalPatients: 0,
      newPatientsThisMonth: 0,
      totalAppointments: 0,
      appointmentsThisMonth: 0,
      totalRevenue: 0,
      revenueThisMonth: 0,
      avgAppointmentDuration: 0,
      patientSatisfaction: 0,
      noShowRate: 0,
      cancellationRate: 0
    },
    patientDemographics: {
      ageGroups: [],
      genderDistribution: [],
      topConditions: []
    },
    appointmentTrends: {
      monthlyData: [],
      weeklyTrends: [],
      hourlyDistribution: []
    },
    aiPerformance: {
      voiceAgentStats: {
        totalCalls: 0,
        successfulCalls: 0,
        avgCallDuration: 0,
        topActions: []
      },
      messageStats: {
        totalSent: 0,
        deliveryRate: 0,
        responseRate: 0,
        channelBreakdown: []
      }
    },
    clinicPerformance: {
      clinicStats: []
    }
  });

  useEffect(() => {
    if (doctor || isAdmin) {
      fetchAnalyticsData();
    }
  }, [doctor, selectedClinic, timeRange, isAdmin]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError('');

    try {
      if (!isSupabaseConfigured) {
        // Use comprehensive demo data for non-configured environments
        setAnalytics({
          overview: {
            totalPatients: 1247,
            newPatientsThisMonth: 89,
            totalAppointments: 2156,
            appointmentsThisMonth: 234,
            totalRevenue: 125400,
            revenueThisMonth: 18750,
            avgAppointmentDuration: 28,
            patientSatisfaction: 4.8,
            noShowRate: 8.2,
            cancellationRate: 12.5
          },
          patientDemographics: {
            ageGroups: [
              { range: '0-18', count: 156, percentage: 12.5 },
              { range: '19-35', count: 298, percentage: 23.9 },
              { range: '36-50', count: 387, percentage: 31.0 },
              { range: '51-65', count: 289, percentage: 23.2 },
              { range: '65+', count: 117, percentage: 9.4 }
            ],
            genderDistribution: [
              { gender: 'Female', count: 678, percentage: 54.4 },
              { gender: 'Male', count: 523, percentage: 41.9 },
              { gender: 'Other', count: 46, percentage: 3.7 }
            ],
            topConditions: [
              { condition: 'Hypertension', count: 234, trend: 'up' },
              { condition: 'Diabetes', count: 189, trend: 'up' },
              { condition: 'Allergies', count: 156, trend: 'stable' },
              { condition: 'Cardiac Issues', count: 123, trend: 'down' },
              { condition: 'Respiratory', count: 98, trend: 'up' }
            ]
          },
          appointmentTrends: {
            monthlyData: [
              { month: 'Jan', appointments: 178, revenue: 14200, noShows: 12 },
              { month: 'Feb', appointments: 195, revenue: 15600, noShows: 18 },
              { month: 'Mar', appointments: 212, revenue: 16950, noShows: 15 },
              { month: 'Apr', appointments: 189, revenue: 15120, noShows: 22 },
              { month: 'May', appointments: 234, revenue: 18750, noShows: 19 },
              { month: 'Jun', appointments: 267, revenue: 21360, noShows: 16 }
            ],
            weeklyTrends: [
              { day: 'Monday', appointments: 45, avgDuration: 32 },
              { day: 'Tuesday', appointments: 52, avgDuration: 28 },
              { day: 'Wednesday', appointments: 48, avgDuration: 30 },
              { day: 'Thursday', appointments: 41, avgDuration: 26 },
              { day: 'Friday', appointments: 38, avgDuration: 29 },
              { day: 'Saturday', appointments: 28, avgDuration: 25 },
              { day: 'Sunday', appointments: 12, avgDuration: 35 }
            ],
            hourlyDistribution: [
              { hour: '8 AM', count: 12 },
              { hour: '9 AM', count: 28 },
              { hour: '10 AM', count: 45 },
              { hour: '11 AM', count: 52 },
              { hour: '12 PM', count: 38 },
              { hour: '1 PM', count: 41 },
              { hour: '2 PM', count: 48 },
              { hour: '3 PM', count: 44 },
              { hour: '4 PM', count: 35 },
              { hour: '5 PM', count: 22 }
            ]
          },
          aiPerformance: {
            voiceAgentStats: {
              totalCalls: 1456,
              successfulCalls: 1298,
              avgCallDuration: 165,
              topActions: [
                { action: 'Schedule Appointment', count: 567 },
                { action: 'Reschedule Appointment', count: 234 },
                { action: 'Provide Information', count: 189 },
                { action: 'Transfer to Doctor', count: 156 },
                { action: 'Take Message', count: 152 }
              ]
            },
            messageStats: {
              totalSent: 3456,
              deliveryRate: 98.5,
              responseRate: 76.3,
              channelBreakdown: [
                { channel: 'WhatsApp', sent: 1567, delivered: 1542, responded: 1198 },
                { channel: 'SMS', sent: 1234, delivered: 1221, responded: 934 },
                { channel: 'Email', sent: 655, delivered: 643, responded: 502 }
              ]
            }
          },
          clinicPerformance: {
            clinicStats: [
              { 
                id: '1', 
                name: 'Main Medical Center', 
                patients: 847, 
                appointments: 1456, 
                revenue: 87500, 
                satisfaction: 4.9,
                utilizationRate: 85.2
              },
              { 
                id: '2', 
                name: 'Downtown Clinic', 
                patients: 400, 
                revenue: 37900, 
                appointments: 700, 
                satisfaction: 4.6,
                utilizationRate: 78.4
              }
            ]
          }
        });
        setLoading(false);
        return;
      }

      // Fetch real analytics data from Supabase database
      await Promise.all([
        fetchOverviewData(),
        fetchPatientDemographics(),
        fetchAppointmentTrends(),
        fetchAIPerformance(),
        fetchClinicPerformance()
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data');
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return { startDate: startDate.toISOString(), endDate: now.toISOString() };
  };

  const fetchOverviewData = async () => {
    try {
      const { startDate, endDate } = getDateRange();
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      
      // Build queries based on user role and clinic selection
      let baseFilter = isAdmin ? {} : { doctor_id: doctor?.id };
      let clinicFilter = selectedClinic && selectedClinic !== 'all' ? { clinic_id: selectedClinic } : {};

      // Fetch total patients
      const { count: totalPatients } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .match({ ...baseFilter, ...clinicFilter });

      // Fetch new patients this month
      const { count: newPatientsThisMonth } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .match({ ...baseFilter, ...clinicFilter })
        .gte('created_at', `${currentMonth}-01T00:00:00`);

      // Fetch total appointments
      const { count: totalAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .match({ ...baseFilter, ...clinicFilter });

      // Fetch appointments this month
      const { count: appointmentsThisMonth } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .match({ ...baseFilter, ...clinicFilter })
        .gte('created_at', `${currentMonth}-01T00:00:00`);

      // Calculate appointment metrics
      const { data: appointmentData } = await supabase
        .from('appointments')
        .select('status, start_ts, end_ts')
        .match({ ...baseFilter, ...clinicFilter })
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      const appointments = appointmentData || [];
      const totalAppointmentsInRange = appointments.length;
      const completedAppointments = appointments.filter(a => a.status === 'complete');
      const cancelledAppointments = appointments.filter(a => a.status === 'cancelled');
      const noShowAppointments = appointments.filter(a => a.status === 'no_show');

      // Calculate average duration for completed appointments
      const avgDuration = completedAppointments.length > 0 
        ? Math.round(completedAppointments.reduce((sum, apt) => {
            const start = new Date(apt.start_ts);
            const end = new Date(apt.end_ts);
            return sum + (end.getTime() - start.getTime()) / (1000 * 60); // Convert to minutes
          }, 0) / completedAppointments.length)
        : 0;

      const noShowRate = totalAppointmentsInRange > 0 ? (noShowAppointments.length / totalAppointmentsInRange) * 100 : 0;
      const cancellationRate = totalAppointmentsInRange > 0 ? (cancelledAppointments.length / totalAppointmentsInRange) * 100 : 0;

      // Estimate revenue (in real app, you'd have a billing/payments table)
      const avgAppointmentValue = 150; // Average appointment value
      const totalRevenue = (totalAppointments || 0) * avgAppointmentValue;
      const revenueThisMonth = (appointmentsThisMonth || 0) * avgAppointmentValue;

      setAnalytics(prev => ({
        ...prev,
        overview: {
          totalPatients: totalPatients || 0,
          newPatientsThisMonth: newPatientsThisMonth || 0,
          totalAppointments: totalAppointments || 0,
          appointmentsThisMonth: appointmentsThisMonth || 0,
          totalRevenue,
          revenueThisMonth,
          avgAppointmentDuration: avgDuration,
          patientSatisfaction: 4.8, // This would come from a feedback/ratings table
          noShowRate,
          cancellationRate
        }
      }));

    } catch (error) {
      console.error('Error fetching overview data:', error);
    }
  };

  const fetchPatientDemographics = async () => {
    try {
      let baseFilter = isAdmin ? {} : { doctor_id: doctor?.id };
      let clinicFilter = selectedClinic && selectedClinic !== 'all' ? { clinic_id: selectedClinic } : {};

      // Fetch all patients for demographics analysis
      const { data: patients } = await supabase
        .from('patients')
        .select('dob, sex, tags')
        .match({ ...baseFilter, ...clinicFilter });

      if (!patients || patients.length === 0) {
        return;
      }

      // Calculate age groups
      const ageGroups = [
        { range: '0-18', count: 0, percentage: 0 },
        { range: '19-35', count: 0, percentage: 0 },
        { range: '36-50', count: 0, percentage: 0 },
        { range: '51-65', count: 0, percentage: 0 },
        { range: '65+', count: 0, percentage: 0 }
      ];

      patients.forEach(patient => {
        const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
        if (age <= 18) ageGroups[0].count++;
        else if (age <= 35) ageGroups[1].count++;
        else if (age <= 50) ageGroups[2].count++;
        else if (age <= 65) ageGroups[3].count++;
        else ageGroups[4].count++;
      });

      ageGroups.forEach(group => {
        group.percentage = (group.count / patients.length) * 100;
      });

      // Calculate gender distribution
      const genderCounts = patients.reduce((acc, patient) => {
        const gender = patient.sex === 'male' ? 'Male' : patient.sex === 'female' ? 'Female' : 'Other';
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const genderDistribution = Object.entries(genderCounts).map(([gender, count]) => ({
        gender,
        count,
        percentage: (count / patients.length) * 100
      }));

      // Calculate top conditions from tags
      const conditionCounts = patients.reduce((acc, patient) => {
        patient.tags?.forEach(tag => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const topConditions = Object.entries(conditionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([condition, count]) => ({
          condition: condition.charAt(0).toUpperCase() + condition.slice(1),
          count,
          trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down' // Random trend for demo
        }));

      setAnalytics(prev => ({
        ...prev,
        patientDemographics: {
          ageGroups,
          genderDistribution,
          topConditions
        }
      }));

    } catch (error) {
      console.error('Error fetching patient demographics:', error);
    }
  };

  const fetchAppointmentTrends = async () => {
    try {
      let baseFilter = isAdmin ? {} : { doctor_id: doctor?.id };
      let clinicFilter = selectedClinic && selectedClinic !== 'all' ? { clinic_id: selectedClinic } : {};

      // Fetch appointments for the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: appointments } = await supabase
        .from('appointments')
        .select('start_ts, end_ts, status, created_at')
        .match({ ...baseFilter, ...clinicFilter })
        .gte('created_at', sixMonthsAgo.toISOString());

      if (!appointments || appointments.length === 0) {
        return;
      }

      // Calculate monthly data
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toISOString().slice(0, 7); // YYYY-MM
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        const monthAppointments = appointments.filter(apt => 
          apt.created_at.startsWith(monthStr)
        );
        
        const noShows = monthAppointments.filter(apt => apt.status === 'no_show').length;
        const revenue = monthAppointments.length * 150; // Estimated revenue
        
        monthlyData.push({
          month: monthName,
          appointments: monthAppointments.length,
          revenue,
          noShows
        });
      }

      // Calculate weekly trends (day of week analysis)
      const weeklyTrends = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
      ].map(day => {
        const dayAppointments = appointments.filter(apt => {
          const aptDay = new Date(apt.start_ts).toLocaleDateString('en-US', { weekday: 'long' });
          return aptDay === day;
        });
        
        const avgDuration = dayAppointments.length > 0 
          ? Math.round(dayAppointments.reduce((sum, apt) => {
              const start = new Date(apt.start_ts);
              const end = new Date(apt.end_ts);
              return sum + (end.getTime() - start.getTime()) / (1000 * 60);
            }, 0) / dayAppointments.length)
          : 0;

        return {
          day,
          appointments: dayAppointments.length,
          avgDuration
        };
      });

      // Calculate hourly distribution
      const hourlyDistribution = [];
      for (let hour = 8; hour <= 17; hour++) {
        const hourAppointments = appointments.filter(apt => {
          const aptHour = new Date(apt.start_ts).getHours();
          return aptHour === hour;
        });
        
        const displayHour = hour <= 12 ? `${hour} AM` : `${hour - 12} PM`;
        if (hour === 12) displayHour = '12 PM';
        
        hourlyDistribution.push({
          hour: displayHour,
          count: hourAppointments.length
        });
      }

      setAnalytics(prev => ({
        ...prev,
        appointmentTrends: {
          monthlyData,
          weeklyTrends,
          hourlyDistribution
        }
      }));

    } catch (error) {
      console.error('Error fetching appointment trends:', error);
    }
  };

  const fetchAIPerformance = async () => {
    try {
      let baseFilter = isAdmin ? {} : { doctor_id: doctor?.id };
      const { startDate, endDate } = getDateRange();

      // Fetch voice agent logs
      const { data: voiceLogs } = await supabase
        .from('voice_agent_logs')
        .select('status, duration_seconds, actions_taken, created_at')
        .match(baseFilter)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      // Fetch messages
      const { data: messages } = await supabase
        .from('messages')
        .select('channel, status, created_at')
        .match(baseFilter)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (voiceLogs && voiceLogs.length > 0) {
        const totalCalls = voiceLogs.length;
        const successfulCalls = voiceLogs.filter(log => log.status === 'completed').length;
        const avgCallDuration = successfulCalls > 0 
          ? Math.round(voiceLogs.reduce((sum, log) => sum + (log.duration_seconds || 0), 0) / successfulCalls)
          : 0;

        // Analyze top actions
        const actionCounts = voiceLogs.reduce((acc, log) => {
          log.actions_taken?.forEach((action: any) => {
            const actionName = action.action?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Action';
            acc[actionName] = (acc[actionName] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>);

        const topActions = Object.entries(actionCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([action, count]) => ({ action, count }));

        setAnalytics(prev => ({
          ...prev,
          aiPerformance: {
            ...prev.aiPerformance,
            voiceAgentStats: {
              totalCalls,
              successfulCalls,
              avgCallDuration,
              topActions
            }
          }
        }));
      }

      if (messages && messages.length > 0) {
        const totalSent = messages.length;
        const delivered = messages.filter(msg => msg.status === 'delivered' || msg.status === 'sent').length;
        const deliveryRate = (delivered / totalSent) * 100;
        const responseRate = 76.3; // This would require a responses table in real implementation

        // Channel breakdown
        const channelBreakdown = ['whatsapp', 'sms', 'email'].map(channel => {
          const channelMessages = messages.filter(msg => msg.channel === channel);
          const channelDelivered = channelMessages.filter(msg => msg.status === 'delivered' || msg.status === 'sent').length;
          
          return {
            channel: channel === 'whatsapp' ? 'WhatsApp' : channel.toUpperCase(),
            sent: channelMessages.length,
            delivered: channelDelivered,
            responded: Math.round(channelDelivered * 0.7) // Estimated response rate
          };
        }).filter(channel => channel.sent > 0);

        setAnalytics(prev => ({
          ...prev,
          aiPerformance: {
            ...prev.aiPerformance,
            messageStats: {
              totalSent,
              deliveryRate,
              responseRate,
              channelBreakdown
            }
          }
        }));
      }

    } catch (error) {
      console.error('Error fetching AI performance data:', error);
    }
  };

  const fetchClinicPerformance = async () => {
    try {
      if (isAdmin) {
        // Fetch all clinics for admin view
        const { data: allClinics } = await supabase
          .from('clinics')
          .select('id, name');

        if (allClinics && allClinics.length > 0) {
          const clinicStats = await Promise.all(
            allClinics.map(async (clinic) => {
              const [patientsRes, appointmentsRes] = await Promise.all([
                supabase.from('patients').select('*', { count: 'exact', head: true }).eq('clinic_id', clinic.id),
                supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('clinic_id', clinic.id)
              ]);

              const patients = patientsRes.count || 0;
              const appointments = appointmentsRes.count || 0;
              const revenue = appointments * 150; // Estimated revenue
              const satisfaction = 4.5 + Math.random() * 0.5; // Random satisfaction between 4.5-5.0
              const utilizationRate = 70 + Math.random() * 25; // Random utilization 70-95%

              return {
                id: clinic.id,
                name: clinic.name,
                patients,
                appointments,
                revenue,
                satisfaction: Math.round(satisfaction * 10) / 10,
                utilizationRate: Math.round(utilizationRate * 10) / 10
              };
            })
          );

          setAnalytics(prev => ({
            ...prev,
            clinicPerformance: { clinicStats }
          }));
        }
      } else if (doctor) {
        // Fetch doctor's clinics
        const { data: doctorClinics } = await supabase
          .from('clinics')
          .select('id, name')
          .eq('doctor_id', doctor.id);

        if (doctorClinics && doctorClinics.length > 0) {
          const clinicStats = await Promise.all(
            doctorClinics.map(async (clinic) => {
              const [patientsRes, appointmentsRes] = await Promise.all([
                supabase.from('patients').select('*', { count: 'exact', head: true }).eq('clinic_id', clinic.id).eq('doctor_id', doctor.id),
                supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('clinic_id', clinic.id).eq('doctor_id', doctor.id)
              ]);

              const patients = patientsRes.count || 0;
              const appointments = appointmentsRes.count || 0;
              const revenue = appointments * 150;
              const satisfaction = 4.5 + Math.random() * 0.5;
              const utilizationRate = 70 + Math.random() * 25;

              return {
                id: clinic.id,
                name: clinic.name,
                patients,
                appointments,
                revenue,
                satisfaction: Math.round(satisfaction * 10) / 10,
                utilizationRate: Math.round(utilizationRate * 10) / 10
              };
            })
          );

          setAnalytics(prev => ({
            ...prev,
            clinicPerformance: { clinicStats }
          }));
        }
      }

    } catch (error) {
      console.error('Error fetching clinic performance data:', error);
    }
  };
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-100';
      case 'down':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'patients', label: 'Patient Analytics', icon: Users },
    { id: 'appointments', label: 'Appointment Trends', icon: Calendar },
    { id: 'ai-performance', label: 'AI Performance', icon: Phone },
    { id: 'clinics', label: 'Clinic Performance', icon: Building2 }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">+12.5%</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalPatients.toLocaleString()}</p>
            <p className="text-sm font-medium text-gray-600">Total Patients</p>
            <p className="text-xs text-gray-500 mt-1">+{analytics.overview.newPatientsThisMonth} this month</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">+8.3%</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalAppointments.toLocaleString()}</p>
            <p className="text-sm font-medium text-gray-600">Total Appointments</p>
            <p className="text-xs text-gray-500 mt-1">+{analytics.overview.appointmentsThisMonth} this month</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">+15.2%</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(analytics.overview.totalRevenue)}</p>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-xs text-gray-500 mt-1">{formatCurrency(analytics.overview.revenueThisMonth)} this month</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">+0.3</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{analytics.overview.patientSatisfaction}</p>
            <p className="text-sm font-medium text-gray-600">Patient Satisfaction</p>
            <p className="text-xs text-gray-500 mt-1">Out of 5.0 stars</p>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Efficiency</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Duration</span>
              <span className="font-semibold text-gray-900">{analytics.overview.avgAppointmentDuration} min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">No-Show Rate</span>
              <span className="font-semibold text-orange-600">{formatPercentage(analytics.overview.noShowRate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cancellation Rate</span>
              <span className="font-semibold text-red-600">{formatPercentage(analytics.overview.cancellationRate)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Voice Agent</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Calls</span>
              <span className="font-semibold text-gray-900">{analytics.aiPerformance.voiceAgentStats.totalCalls}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="font-semibold text-green-600">
                {formatPercentage((analytics.aiPerformance.voiceAgentStats.successfulCalls / analytics.aiPerformance.voiceAgentStats.totalCalls) * 100)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Call Duration</span>
              <span className="font-semibold text-gray-900">{Math.floor(analytics.aiPerformance.voiceAgentStats.avgCallDuration / 60)}:{(analytics.aiPerformance.voiceAgentStats.avgCallDuration % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Messages Sent</span>
              <span className="font-semibold text-gray-900">{analytics.aiPerformance.messageStats.totalSent}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Delivery Rate</span>
              <span className="font-semibold text-green-600">{formatPercentage(analytics.aiPerformance.messageStats.deliveryRate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Rate</span>
              <span className="font-semibold text-blue-600">{formatPercentage(analytics.aiPerformance.messageStats.responseRate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatientAnalytics = () => (
    <div className="space-y-6">
      {/* Age Demographics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Patient Age Distribution</h3>
        <div className="space-y-4">
          {analytics.patientDemographics.ageGroups.map((group, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-sm font-medium text-gray-700">{group.range}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{group.count} patients</span>
                  <span className="text-sm font-medium text-gray-900">{formatPercentage(group.percentage)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${group.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gender Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Gender Distribution</h3>
          <div className="space-y-4">
            {analytics.patientDemographics.genderDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    item.gender === 'Female' ? 'bg-pink-500' :
                    item.gender === 'Male' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.gender}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{item.count}</div>
                  <div className="text-xs text-gray-500">{formatPercentage(item.percentage)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Medical Conditions</h3>
          <div className="space-y-4">
            {analytics.patientDemographics.topConditions.map((condition, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{condition.condition}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">{condition.count}</span>
                  <div className={`p-1 rounded-full ${getTrendColor(condition.trend)}`}>
                    {getTrendIcon(condition.trend)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointmentTrends = () => (
    <div className="space-y-6">
      {/* Monthly Trends */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Appointment Trends</h3>
        <div className="grid grid-cols-6 gap-4">
          {analytics.appointmentTrends.monthlyData.map((month, index) => (
            <div key={index} className="text-center">
              <div className="mb-2">
                <div 
                  className="bg-blue-600 rounded-t mx-auto transition-all duration-300"
                  style={{ 
                    width: '24px',
                    height: `${(month.appointments / Math.max(...analytics.appointmentTrends.monthlyData.map(m => m.appointments))) * 100}px`,
                    minHeight: '20px'
                  }}
                ></div>
              </div>
              <div className="text-xs font-medium text-gray-900">{month.month}</div>
              <div className="text-xs text-gray-600">{month.appointments}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Appointment Distribution</h3>
          <div className="space-y-3">
            {analytics.appointmentTrends.weeklyTrends.map((day, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-medium text-gray-700">{day.day}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{day.appointments} appointments</span>
                    <span className="text-sm text-gray-500">{day.avgDuration} min avg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(day.appointments / Math.max(...analytics.appointmentTrends.weeklyTrends.map(d => d.appointments))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Peak Hours</h3>
          <div className="space-y-3">
            {analytics.appointmentTrends.hourlyDistribution.map((hour, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-16 text-sm font-medium text-gray-700">{hour.hour}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{hour.count} appointments</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(hour.count / Math.max(...analytics.appointmentTrends.hourlyDistribution.map(h => h.count))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIPerformance = () => (
    <div className="space-y-6">
      {/* Voice Agent Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Voice Agent Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.aiPerformance.voiceAgentStats.totalCalls}</p>
            <p className="text-sm text-gray-600">Total Calls</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatPercentage((analytics.aiPerformance.voiceAgentStats.successfulCalls / analytics.aiPerformance.voiceAgentStats.totalCalls) * 100)}
            </p>
            <p className="text-sm text-gray-600">Success Rate</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.floor(analytics.aiPerformance.voiceAgentStats.avgCallDuration / 60)}:{(analytics.aiPerformance.voiceAgentStats.avgCallDuration % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-sm text-gray-600">Avg Duration</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.aiPerformance.voiceAgentStats.topActions.length}</p>
            <p className="text-sm text-gray-600">Action Types</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Top AI Actions Performed</h4>
          <div className="space-y-3">
            {analytics.aiPerformance.voiceAgentStats.topActions.map((action, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium text-gray-700">{action.action}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{action.count} times</span>
                    <span className="text-sm text-gray-500">
                      {formatPercentage((action.count / analytics.aiPerformance.voiceAgentStats.totalCalls) * 100)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(action.count / Math.max(...analytics.aiPerformance.voiceAgentStats.topActions.map(a => a.count))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Channel Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Message Channel Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analytics.aiPerformance.messageStats.channelBreakdown.map((channel, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  channel.channel === 'WhatsApp' ? 'bg-green-100' :
                  channel.channel === 'SMS' ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  <MessageSquare className={`w-5 h-5 ${
                    channel.channel === 'WhatsApp' ? 'text-green-600' :
                    channel.channel === 'SMS' ? 'text-blue-600' : 'text-purple-600'
                  }`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{channel.channel}</h4>
                  <p className="text-sm text-gray-600">{channel.sent} sent</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivered:</span>
                  <span className="font-medium">{formatPercentage((channel.delivered / channel.sent) * 100)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Responded:</span>
                  <span className="font-medium">{formatPercentage((channel.responded / channel.sent) * 100)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderClinicPerformance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {analytics.clinicPerformance.clinicStats.map((clinic, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
                  <p className="text-sm text-gray-600">Performance Overview</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{formatPercentage(clinic.utilizationRate)}</div>
                <div className="text-sm text-gray-600">Utilization Rate</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-blue-900">{clinic.patients}</div>
                <div className="text-xs text-blue-600">Patients</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-green-900">{clinic.appointments}</div>
                <div className="text-xs text-green-600">Appointments</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-purple-900">{formatCurrency(clinic.revenue)}</div>
                <div className="text-xs text-purple-600">Revenue</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <Heart className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-orange-900">{clinic.satisfaction}</div>
                <div className="text-xs text-orange-600">Satisfaction</div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 text-center">
                <Activity className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-indigo-900">{formatPercentage(clinic.utilizationRate)}</div>
                <div className="text-xs text-indigo-600">Utilization</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError('');
              fetchAnalyticsData();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
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
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">
              {isAdmin ? 'System-wide analytics and performance metrics' : 'Practice analytics and insights'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
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

        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'patients' && renderPatientAnalytics()}
          {activeTab === 'appointments' && renderAppointmentTrends()}
          {activeTab === 'ai-performance' && renderAIPerformance()}
          {activeTab === 'clinics' && renderClinicPerformance()}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;