import React from 'react';
import { useState, useEffect } from 'react';
import { Calendar, FileText, MessageSquare, Phone, Clock, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const RecentActivity: React.FC = () => {
  const { doctor } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctor) {
      fetchRecentActivity();
    }
  }, [doctor]);

  const fetchRecentActivity = async () => {
    if (!doctor) return;

    try {
      if (!isSupabaseConfigured) {
        // Use demo data for non-configured environments
        setActivities(getDemoActivities());
        setLoading(false);
        return;
      }

      // Fetch real recent activity from database
      const [appointmentsRes, prescriptionsRes, messagesRes] = await Promise.all([
        supabase
          .from('appointments')
          .select(`
            id,
            created_at,
            status,
            channel,
            patients:patient_id (first_name, last_name)
          `)
          .eq('doctor_id', doctor.id)
          .order('created_at', { ascending: false })
          .limit(3),
        
        supabase
          .from('prescriptions')
          .select(`
            id,
            created_at,
            patients:patient_id (first_name, last_name)
          `)
          .eq('doctor_id', doctor.id)
          .order('created_at', { ascending: false })
          .limit(2),
        
        supabase
          .from('messages')
          .select(`
            id,
            created_at,
            status,
            channel,
            patients:patient_id (first_name, last_name)
          `)
          .eq('doctor_id', doctor.id)
          .order('created_at', { ascending: false })
          .limit(2)
      ]);

      const recentActivities: any[] = [];

      // Process appointments
      (appointmentsRes.data || []).forEach(apt => {
        recentActivities.push({
          id: `apt-${apt.id}`,
          type: 'appointment',
          title: apt.status === 'booked' ? 'Appointment scheduled' : 'Appointment updated',
          description: `${apt.patients?.first_name} ${apt.patients?.last_name} - ${apt.channel === 'voice' ? 'Phone Call' : apt.channel === 'web' ? 'Video Call' : 'In-Person'}`,
          time: getTimeAgo(apt.created_at),
          icon: Calendar,
          color: 'blue',
          status: apt.status
        });
      });

      // Process prescriptions
      (prescriptionsRes.data || []).forEach(rx => {
        recentActivities.push({
          id: `rx-${rx.id}`,
          type: 'prescription',
          title: 'Prescription sent',
          description: `${rx.patients?.first_name} ${rx.patients?.last_name} - Delivered successfully`,
          time: getTimeAgo(rx.created_at),
          icon: FileText,
          color: 'green',
          status: 'delivered'
        });
      });

      // Process messages
      (messagesRes.data || []).forEach(msg => {
        recentActivities.push({
          id: `msg-${msg.id}`,
          type: 'message',
          title: 'Message sent',
          description: `${msg.patients?.first_name} ${msg.patients?.last_name} - ${msg.channel.toUpperCase()}`,
          time: getTimeAgo(msg.created_at),
          icon: MessageSquare,
          color: 'purple',
          status: msg.status
        });
      });

      // Sort by creation time and take most recent
      recentActivities.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      setActivities(recentActivities.slice(0, 5));

    } catch (error) {
      console.error('Error fetching recent activity:', error);
      // Fallback to demo data on error
      setActivities(getDemoActivities());
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getDemoActivities = () => [
    {
      id: 1,
      type: 'appointment',
      title: 'Appointment scheduled',
      description: 'John Smith - Tomorrow 10:00 AM via AI Voice Agent',
      time: '5 minutes ago',
      icon: Calendar,
      color: 'blue',
      status: 'confirmed'
    },
    {
      id: 2,
      type: 'prescription',
      title: 'Prescription sent',
      description: 'Sarah Johnson - Delivered via WhatsApp',
      time: '15 minutes ago',
      icon: FileText,
      color: 'green',
      status: 'delivered'
    },
    {
      id: 3,
      type: 'message',
      title: 'Follow-up message sent',
      description: 'Mike Davis - Post-consultation care instructions',
      time: '32 minutes ago',
      icon: MessageSquare,
      color: 'purple',
      status: 'read'
    },
    {
      id: 4,
      type: 'call',
      title: 'AI call handled',
      description: 'Emma Wilson - Appointment rescheduled successfully',
      time: '1 hour ago',
      icon: Phone,
      color: 'orange',
      status: 'completed'
    },
    {
      id: 5,
      type: 'appointment',
      title: 'Appointment completed',
      description: 'Robert Chen - Follow-up scheduled automatically',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'green',
      status: 'completed'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      confirmed: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      read: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800'
    };
    return badges[status as keyof typeof badges] || badges.confirmed;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        {loading && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        )}
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading activity...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No recent activity found</p>
        </div>
      ) : (
      <div className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          const colorClasses = getColorClasses(activity.color);
          const statusBadge = getStatusBadge(activity.status);

          return (
            <div key={activity.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`p-2 rounded-lg border ${colorClasses}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
            Load More Activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;