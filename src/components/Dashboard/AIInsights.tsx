import React from 'react';
import { Brain, TrendingUp, Users, MessageSquare, Calendar, AlertCircle } from 'lucide-react';

const AIInsights: React.FC = () => {
  const insights = [
    {
      type: 'scheduling',
      title: 'Peak Booking Hours',
      description: 'Most appointments are scheduled between 10-11 AM. Consider adjusting AI agent availability.',
      icon: Calendar,
      color: 'blue',
      action: 'Optimize Schedule'
    },
    {
      type: 'communication',
      title: 'Message Response Rate',
      description: '95% of patients respond to WhatsApp messages within 2 hours.',
      icon: MessageSquare,
      color: 'green',
      action: 'View Analytics'
    },
    {
      type: 'patients',
      title: 'Follow-up Reminders',
      description: '12 patients need follow-up appointments this week.',
      icon: Users,
      color: 'orange',
      action: 'Send Reminders'
    },
    {
      type: 'ai-usage',
      title: 'AI Voice Agent Performance',
      description: '89% successful call resolution rate. 23 calls handled today.',
      icon: Brain,
      color: 'purple',
      action: 'View Details'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
      orange: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span>Real-time</span>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const IconComponent = insight.icon;
          const colorClasses = getColorClasses(insight.color);

          return (
            <div key={index} className={`border rounded-lg p-4 transition-colors ${colorClasses.includes('border-') ? colorClasses : `border-gray-200 hover:${colorClasses.split(' ')[0]}`}`}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{insight.title}</h3>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      {insight.action}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <div>
            <h3 className="font-medium text-orange-900">Recommendation</h3>
            <p className="text-sm text-orange-700 mt-1">
              Consider enabling automated follow-up reminders for better patient engagement.
            </p>
          </div>
          <button className="ml-auto px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full hover:bg-orange-200 transition-colors">
            Enable Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;