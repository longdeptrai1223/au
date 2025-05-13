import { useState } from 'react';
import { useMining } from '../contexts/MiningContext';
import { formatTimeRemaining } from '../lib/utils';

export const useAdBoost = () => {
  const { 
    adBoostActive, 
    adBoostTimeRemaining, 
    watchAd 
  } = useMining();
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  
  const handleWatchAd = async () => {
    try {
      setIsWatchingAd(true);
      await watchAd();
    } catch (error) {
      console.error('Error watching ad:', error);
    } finally {
      setIsWatchingAd(false);
    }
  };
  
  return {
    isActive: adBoostActive,
    timeRemaining: adBoostTimeRemaining,
    formattedTimeRemaining: formatTimeRemaining(adBoostTimeRemaining),
    watchAd: handleWatchAd,
    isWatchingAd,
  };
};
