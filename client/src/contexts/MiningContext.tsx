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
      // This function will show a real AdMob rewarded ad
      return new Promise<void>((resolve, reject) => {
        // Check if AdMob is available
        if (!window.google || !window.google.ima) {
          // Load Google IMA SDK if not already loaded
          const script = document.createElement('script');
          script.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
          script.async = true;
          script.onload = () => {
            initializeAdMob(resolve, reject);
          };
          script.onerror = () => {
            console.error("Error loading IMA SDK");
            reject(new Error("Failed to load ad SDK"));
          };
          document.body.appendChild(script);
        } else {
          // IMA SDK already loaded
          initializeAdMob(resolve, reject);
        }
      })
      .then(async () => {
        // Ad was successfully watched, apply boost
        // Update ad boost time (adds 2 hours)
        await updateAdBoostTime(user.uid, 2);
        
        // Add activity
        await addActivity(user.uid, "ad_boost", "+200%", "Xem quảng cáo");
        
        toast({
          title: "Boost Activated",
          description: "You've received a mining boost of +200% for 2 hours!",
        });
      });
    } catch (error) {
      console.error("Ad boost error:", error);
      toast({
        title: "Boost Failed",
        description: "There was a problem activating your boost. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Note: We've moved the Google IMA SDK type definitions to client/src/types/ima-sdk.d.ts

  // Helper function to initialize and show AdMob rewarded ad
  const initializeAdMob = (resolve: () => void, reject: (reason?: any) => void) => {
    const adContainer = document.createElement('div');
    adContainer.style.position = 'fixed';
    adContainer.style.zIndex = '1000';
    adContainer.style.top = '0';
    adContainer.style.left = '0';
    adContainer.style.width = '100%';
    adContainer.style.height = '100%';
    adContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    document.body.appendChild(adContainer);
    
    // Get AdMob Rewarded ID from environment variables
    const adUnit = import.meta.env.VITE_ADMOB_REWARDED_ID || '';
    
    if (!adUnit) {
      console.error("Missing AdMob Rewarded ID");
      document.body.removeChild(adContainer);
      reject(new Error("Missing AdMob configuration"));
      return;
    }
    
    try {
      // Make sure Google IMA is available
      if (!window.google || !window.google.ima) {
        throw new Error("Google IMA SDK not available");
      }
      
      // Since we've checked above that google & ima are not undefined, we can safely use them
      const google = window.google;
      
      // Initialize Google IMA ads
      const adDisplayContainer = new google.ima.AdDisplayContainer(adContainer);
      adDisplayContainer.initialize();
      
      const adsLoader = new google.ima.AdsLoader(adDisplayContainer);
      const adsRequest = new google.ima.AdsRequest();
      
      // Specify the ad unit
      adsRequest.adTagUrl = `https://googleads.g.doubleclick.net/pagead/ads?ad_type=video_image&client=ca-video-pub-${adUnit}&description_url=${encodeURIComponent(window.location.href)}&videoad_start_delay=0&hl=vi`;
      
      // Specify ad size
      adsRequest.linearAdSlotWidth = window.innerWidth;
      adsRequest.linearAdSlotHeight = window.innerHeight;
      adsRequest.nonLinearAdSlotWidth = window.innerWidth;
      adsRequest.nonLinearAdSlotHeight = window.innerHeight;
      
      // Request ad
      adsLoader.requestAds(adsRequest);
      
      // Handle ad events
      adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        (event: any) => {
          // Get the ads manager
          const adsManager = event.getAdsManager();
          
          // Add event listeners
          adsManager.addEventListener(
            google.ima.AdEvent.Type.COMPLETE,
            () => {
              adsManager.destroy();
              document.body.removeChild(adContainer);
              resolve(); // User completed watching ad
            }
          );
          
          adsManager.addEventListener(
            google.ima.AdEvent.Type.SKIPPED,
            () => {
              adsManager.destroy();
              document.body.removeChild(adContainer);
              reject(new Error("Ad was skipped")); // User skipped ad
            }
          );
          
          adsManager.addEventListener(
            google.ima.AdEvent.Type.ERROR,
            () => {
              adsManager.destroy();
              document.body.removeChild(adContainer);
              reject(new Error("Ad error")); // Ad error
            }
          );
          
          // Start ad
          adsManager.init(
            window.innerWidth,
            window.innerHeight,
            google.ima.ViewMode.NORMAL
          );
          adsManager.start();
        }
      );
      
      adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        (event: any) => {
          console.error("Ad Error:", event.getError());
          document.body.removeChild(adContainer);
          reject(new Error("Ad error"));
        }
      );
    } catch (error) {
      console.error("AdMob initialization error:", error);
      document.body.removeChild(adContainer);
      reject(error);
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
