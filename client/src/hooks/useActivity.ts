import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserActivities } from '../lib/firebase';
import { formatDate } from '../lib/utils';

interface Activity {
  id: string;
  type: string;
  amount: string;
  details: string;
  createdAt: any;
  formattedDate?: string;
}

export const useActivity = (limit = 5) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    const unsubscribe = getUserActivities(user.uid, (data) => {
      // Format the dates and limit the results
      const formattedActivities = data
        .slice(0, limit)
        .map(activity => ({
          ...activity,
          formattedDate: formatDate(activity.createdAt?.toDate())
        }));
      
      setActivities(formattedActivities);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [user, limit]);
  
  return {
    activities,
    loading,
  };
};
