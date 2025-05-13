import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserActivities } from '../lib/firebase';
import { formatDate } from '../lib/utils';

interface Activity {
  id: string;
  type: string;
  amount: string;
  details: string;
  createdAt: any;
}

const ActivityCard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getUserActivities(user.uid, (data) => {
      setActivities(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'claim':
        return (
          <div className="w-8 h-8 rounded-full bg-[#4CD4C8]/20 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#4CD4C8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="8" r="6" />
              <circle cx="16" cy="16" r="6" />
              <path d="M8.3 6.3 16 16" />
            </svg>
          </div>
        );
      case 'referral':
        return (
          <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FFD700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        );
      case 'ad_boost':
        return (
          <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FFD700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
              <polyline points="17 2 12 7 7 2" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-600/20 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
        );
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'claim':
        return 'text-[#4CD4C8]';
      case 'referral':
      case 'ad_boost':
        return 'text-[#FFD700]';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="bg-[#1E1E1E] rounded-xl shadow-lg p-4 mb-6">
      <h2 className="text-lg font-medium mb-4">Hoạt động gần đây</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-[#FFD700]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          Chưa có hoạt động nào
        </div>
      ) : (
        activities.slice(0, 4).map((activity, index) => (
          <div 
            key={activity.id}
            className={`${index < activities.length - 1 ? 'border-b border-[#2C2C2C]' : ''} py-3 flex items-center justify-between`}
          >
            <div className="flex items-center">
              {getActivityIcon(activity.type)}
              <div>
                <div className="font-medium">{activity.details}</div>
                <div className="text-xs text-gray-400">{formatDate(activity.createdAt?.toDate())}</div>
              </div>
            </div>
            <div className={`font-medium ${getAmountColor(activity.type)}`}>{activity.amount}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActivityCard;
