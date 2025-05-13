import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  updateUserBalance, 
  updateUserMiningClaim, 
  updateAdBoostTime,
  addActivity 
} from '../lib/firebase';
import { useAuth } from './AuthContext';
import { useToast } from '../hooks/use-toast';
import { calculateMiningBoost, calculateMiningRate } from '../lib/utils';

interface MiningContextProps {
  baseRate: number;
  miningProgress: number;
  dailyTarget: number;
  timeRemaining: number;
  referralBoost: number;
  adBoost: number;
  totalBoost: number;
  miningRate: number;
  adBoostTimeRemaining: number;
  adBoostActive: boolean;
  claimReward: () => Promise<boolean>;
  watchAd: () => Promise<void>;
}

const MiningContext = createContext<MiningContextProps>({
  baseRate: 0.0042,  // Default base rate per hour
  miningProgress: 0,
  dailyTarget: 0.1,
  timeRemaining: 0,
  referralBoost: 0,
  adBoost: 0,
  totalBoost: 0,
  miningRate: 0,
  adBoostTimeRemaining: 0,
  adBoostActive: false,
  claimReward: async () => false,
  watchAd: async () => {},
});

export const useMining = () => useContext(MiningContext);

export const MiningProvider = ({ children }: { children: ReactNode }) => {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [miningProgress, setMiningProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [adBoostTimeRemaining, setAdBoostTimeRemaining] = useState(0);
  const [adBoostActive, setAdBoostActive] = useState(false);

  // Constants
  const baseRate = 0.0042;  // Base rate per hour
  const dailyTarget = 0.1;  // Daily mining target

  // Calculate boosts
  const { referralBoost, adBoost, totalBoost } = calculateMiningBoost(
    userData?.referrals || [],
    adBoostActive
  );
  
  // Calculate the actual mining rate with boost applied
  const miningRate = calculateMiningRate(baseRate, totalBoost);

  // Update the mining progress based on time and rate
  useEffect(() => {
    if (!userData) return;

    const updateProgress = () => {
      // If user has never claimed or next claim is in the past, show 100% progress
      if (!userData.nextMiningClaim || new Date(userData.nextMiningClaim.toDate()) <= new Date()) {
        setMiningProgress(dailyTarget);
        setTimeRemaining(0);
        return;
      }

      // Calculate time since last claim
      const now = new Date();
      const lastClaim = userData.lastMiningClaim ? new Date(userData.lastMiningClaim.toDate()) : now;
      const nextClaim = new Date(userData.nextMiningClaim.toDate());
      
      // Calculate remaining time in seconds
      const remainingSeconds = Math.max(0, (nextClaim.getTime() - now.getTime()) / 1000);
      setTimeRemaining(remainingSeconds);
      
      // Calculate elapsed time in hours since last claim
      const elapsedHours = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
      
      // Calculate progress based on mining rate and elapsed time
      let progress = miningRate * elapsedHours;
      
      // Cap progress at the daily target
      progress = Math.min(progress, dailyTarget);
      setMiningProgress(progress);
    };

    updateProgress();
    
    // Update every second
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [userData, miningRate, dailyTarget]);

  // Update ad boost status
  useEffect(() => {
    if (!userData) return;

    const updateAdBoost = () => {
      const now = new Date();
      
      if (userData.adBoostEndTime && userData.adBoostEndTime.toDate() > now) {
        const remainingMs = userData.adBoostEndTime.toDate().getTime() - now.getTime();
        setAdBoostTimeRemaining(remainingMs / 1000);
        setAdBoostActive(true);
      } else {
        setAdBoostTimeRemaining(0);
        setAdBoostActive(false);
      }
    };

    updateAdBoost();
    
    // Update every second
    const interval = setInterval(updateAdBoost, 1000);
    return () => clearInterval(interval);
  }, [userData]);

  // Function to claim mining reward
  const claimReward = async (): Promise<boolean> => {
    if (!user || !userData) return false;
    
    try {
      // Check if eligible to claim
      const now = new Date();
      const nextClaim = userData.nextMiningClaim ? new Date(userData.nextMiningClaim.toDate()) : new Date(0);
      
      if (now < nextClaim) {
        toast({
          title: "Cannot Claim Yet",
          description: `Please wait until the mining cycle completes.`,
          variant: "destructive",
        });
        return false;
      }
      
      // Calculate new balance
      const newBalance = userData.balance + dailyTarget;
      
      // Update user balance
      await updateUserBalance(user.uid, newBalance);
      
      // Update mining claim timestamp
      await updateUserMiningClaim(user.uid);
      
      // Add activity
      await addActivity(user.uid, "claim", `+${dailyTarget} Au`, "Nhận Au hàng ngày");
      
      toast({
        title: "Reward Claimed",
        description: `You have received ${dailyTarget} Au coins!`,
      });
      
      return true;
    } catch (error) {
      console.error("Claim error:", error);
      toast({
        title: "Claim Failed",
        description: "There was a problem claiming your reward.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Function to watch ad and get boost
  const watchAd = async () => {
    if (!user) return;
    
    try {
      // Normally, this would show an actual ad, but for now we'll just simulate it
      // In production, you would integrate with AdMob here
      
      // Update ad boost time (adds 2 hours)
      await updateAdBoostTime(user.uid, 2);
      
      // Add activity
      await addActivity(user.uid, "ad_boost", "+200%", "Xem quảng cáo");
      
      toast({
        title: "Boost Activated",
        description: "You've received a mining boost of +200% for 2 hours!",
      });
    } catch (error) {
      console.error("Ad boost error:", error);
      toast({
        title: "Boost Failed",
        description: "There was a problem activating your boost.",
        variant: "destructive",
      });
    }
  };

  return (
    <MiningContext.Provider value={{
      baseRate,
      miningProgress,
      dailyTarget,
      timeRemaining,
      referralBoost,
      adBoost,
      totalBoost,
      miningRate,
      adBoostTimeRemaining,
      adBoostActive,
      claimReward,
      watchAd,
    }}>
      {children}
    </MiningContext.Provider>
  );
};
