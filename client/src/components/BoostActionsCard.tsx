import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMining } from '../contexts/MiningContext';
import { ReferralModal } from './modals/ReferralModal';
import { AdModal } from './modals/AdModal';
import { formatTimeRemaining } from '../lib/utils';

const BoostActionsCard = () => {
  const { userData } = useAuth();
  const { referralBoost, adBoostTimeRemaining, adBoostActive } = useMining();
  
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  
  const referralCount = userData?.referrals?.length || 0;
  const maxReferrals = 20;
  const referralPercentage = (referralCount / maxReferrals) * 100;

  return (
    <>
      <div className="bg-[#1E1E1E] rounded-xl shadow-lg p-4 mb-6">
        <h2 className="text-lg font-medium mb-4">Tăng hiệu suất đào</h2>
        
        {/* Referral Boost */}
        <div className="bg-[#2C2C2C] rounded-lg p-4 mb-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FFD700] mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h3 className="font-medium">Mời bạn bè</h3>
            </div>
            <span className="text-sm bg-[#121212]/60 text-[#FFD700] px-2 py-0.5 rounded">+10% mỗi người</span>
          </div>
          
          <p className="text-sm text-gray-400 mb-3">Mời bạn bè tham gia để tăng hiệu suất đào. Tối đa +200%.</p>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Số lượt mời: <span className="text-white">{referralCount}/{maxReferrals}</span></span>
            <span className="text-sm text-[#4CD4C8]">+{referralBoost}%</span>
          </div>
          
          <div className="h-1.5 bg-[#121212] rounded-full overflow-hidden mb-4">
            <div className="h-full bg-[#4CD4C8]" style={{ width: `${referralPercentage}%` }}></div>
          </div>
          
          <button 
            onClick={() => setIsReferralModalOpen(true)}
            className="w-full bg-[#121212] text-white font-medium py-2.5 rounded-lg flex items-center justify-center transition hover:bg-opacity-80"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Chia sẻ liên kết giới thiệu
          </button>
        </div>
        
        {/* Ad Boost */}
        <div className="bg-[#2C2C2C] rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FFD700] mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                <polyline points="17 2 12 7 7 2" />
              </svg>
              <h3 className="font-medium">Xem quảng cáo</h3>
            </div>
            <span className="text-sm bg-[#121212]/60 text-[#FFD700] px-2 py-0.5 rounded">+200% trong 2 giờ</span>
          </div>
          
          <p className="text-sm text-gray-400 mb-3">Xem quảng cáo để tăng hiệu suất đào tạm thời. Thời gian cộng dồn.</p>
          
          {/* Ad Boost Timer (if active) */}
          {adBoostActive && (
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Thời gian còn lại:</span>
              <span className="text-sm font-medium text-[#4CD4C8]">{formatTimeRemaining(adBoostTimeRemaining)}</span>
            </div>
          )}
          
          <button 
            onClick={() => setIsAdModalOpen(true)}
            className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFD700]/70 text-[#121212] font-medium py-2.5 rounded-lg flex items-center justify-center transition hover:opacity-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            Xem quảng cáo
          </button>
        </div>
      </div>
      
      <ReferralModal isOpen={isReferralModalOpen} onClose={() => setIsReferralModalOpen(false)} />
      <AdModal isOpen={isAdModalOpen} onClose={() => setIsAdModalOpen(false)} />
    </>
  );
};

export default BoostActionsCard;
