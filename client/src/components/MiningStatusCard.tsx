import { useState } from 'react';
import { useMining } from '../contexts/MiningContext';
import { formatTimeRemaining, formatMiningRate } from '../lib/utils';
import { ClaimModal } from './modals/ClaimModal';

const MiningStatusCard = () => {
  const {
    miningProgress,
    dailyTarget,
    timeRemaining,
    totalBoost,
    miningRate,
    claimReward
  } = useMining();
  
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  
  const progressPercentage = Math.min(100, (miningProgress / dailyTarget) * 100);
  
  const handleClaimClick = async () => {
    if (timeRemaining <= 0) {
      setIsClaimModalOpen(true);
    }
  };
  
  const handleClaimConfirm = async () => {
    const claimed = await claimReward();
    if (claimed) {
      setIsClaimModalOpen(false);
    }
  };

  return (
    <>
      <div className="bg-[#1E1E1E] rounded-xl shadow-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Trạng thái đào</h2>
          
          {/* Mining Boost Badge */}
          <div className="bg-[#2C2C2C] rounded-full py-1 px-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FFD700] mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6" />
              <path d="M10 22h4" />
            </svg>
            <span className="text-[#FFD700] text-sm font-medium">+{totalBoost}%</span>
          </div>
        </div>
        
        {/* Mining Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Tiến trình đào hôm nay</span>
            <span className="text-sm text-white font-medium">{miningProgress.toFixed(2)}/{dailyTarget.toFixed(1)} Au</span>
          </div>
          <div className="h-2.5 bg-[#2C2C2C] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#4CD4C8] to-[#FFD700]" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
        
        {/* Mining Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Mining Rate */}
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4CD4C8] mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
            <div>
              <div className="text-xs text-gray-400">Tốc độ đào:</div>
              <div className="font-medium">{formatMiningRate(miningRate)} Au/giờ</div>
            </div>
          </div>
          
          {/* Efficiency */}
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FFD700] mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <div>
              <div className="text-xs text-gray-400">Hiệu suất:</div>
              <div className="font-medium">+{totalBoost}%</div>
            </div>
          </div>
        </div>
        
        {/* Mining Timer */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-400">Thời gian còn lại:</div>
            <div className="text-xl font-semibold">{formatTimeRemaining(timeRemaining)}</div>
          </div>
          
          {/* Visual Mining Indicator */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 160 160">
              {/* Background Circle */}
              <circle cx="80" cy="80" r="70" stroke="#2C2C2C" strokeWidth="12" fill="none" />
              
              {/* Progress Ring */}
              <circle 
                className="mining-ring" 
                cx="80" cy="80" r="70" 
                stroke="#FFD700" 
                strokeWidth="12" 
                fill="none" 
                strokeDashoffset={440 - (440 * progressPercentage / 100)} 
              />
              
              {/* Additional Progress Indicator for Boost */}
              <circle 
                cx="80" cy="80" r="70" 
                stroke="#4CD4C8" 
                strokeWidth="12" 
                fill="none" 
                strokeDasharray="440" 
                strokeDashoffset={396} 
                className="mining-ring" 
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white">MINING</span>
            </div>
          </div>
        </div>
        
        {/* Claim Button */}
        <button 
          onClick={handleClaimClick}
          disabled={timeRemaining > 0}
          className={`w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#121212] font-semibold py-3.5 rounded-lg flex items-center justify-center transition ${timeRemaining > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="6" />
            <circle cx="16" cy="16" r="6" />
            <path d="M8.3 6.3 16 16" />
          </svg>
          NHẬN THƯỞNG HÀNG NGÀY
        </button>
      </div>
      
      <ClaimModal 
        isOpen={isClaimModalOpen} 
        onClose={() => setIsClaimModalOpen(false)} 
        onClaim={handleClaimConfirm}
        reward={dailyTarget}
      />
    </>
  );
};

export default MiningStatusCard;
