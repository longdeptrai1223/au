import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './use-toast';

export const useReferral = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [isCopying, setIsCopying] = useState(false);
  
  const generateReferralLink = useCallback(() => {
    if (!userData?.referralCode) return '';
    
    // Use current domain for the referral link
    const baseUrl = window.location.origin;
    return `${baseUrl}?ref=${userData.referralCode}`;
  }, [userData]);
  
  const copyReferralLink = useCallback(async () => {
    const link = generateReferralLink();
    
    if (!link) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo link giới thiệu.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(link);
      toast({
        title: "Thành công",
        description: "Link giới thiệu đã được sao chép.",
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Lỗi",
        description: "Không thể sao chép vào clipboard.",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  }, [generateReferralLink, toast]);
  
  const shareReferralLink = useCallback(async () => {
    const link = generateReferralLink();
    
    if (!link) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo link giới thiệu.",
        variant: "destructive",
      });
      return;
    }
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AuMiner - Tham gia cùng tôi!",
          text: "Đào Au coin mỗi ngày và nhận thưởng với hiệu suất cao. Dùng link giới thiệu của tôi!",
          url: link,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        // If sharing fails, fall back to copying
        await copyReferralLink();
      }
    } else {
      // If Web Share API is not available, fall back to copying
      await copyReferralLink();
    }
  }, [generateReferralLink, copyReferralLink, toast]);
  
  return {
    referralCode: userData?.referralCode || '',
    referralLink: generateReferralLink(),
    referralCount: userData?.referrals?.length || 0,
    maxReferrals: 20,
    copyReferralLink,
    shareReferralLink,
    isCopying,
  };
};
