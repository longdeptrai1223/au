import { useState } from 'react';
import { useLocation } from 'wouter';
import { ReferralModal } from './modals/ReferralModal';

const BottomNavigation = () => {
  const [location, setLocation] = useLocation();
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  const isActive = (path: string) => {
    return location === path;
  };

  const navigateTo = (path: string) => {
    setLocation(path);
  };

  const openReferralModal = () => {
    setIsReferralModalOpen(true);
  };

  return (
    <>
      <nav className="bg-[#1E1E1E] border-t border-[#2C2C2C] flex justify-around py-2">
        <button 
          className={`flex flex-col items-center justify-center p-2 ${isActive('/') ? 'text-[#4CD4C8]' : 'text-gray-500'}`}
          onClick={() => navigateTo('/')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="text-xs mt-1">Trang chủ</span>
        </button>
        
        <button className="flex flex-col items-center justify-center p-2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
            <path d="M2 7h20"/>
            <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>
          </svg>
          <span className="text-xs mt-1">Market</span>
        </button>
        
        <div className="flex items-center justify-center">
          <button className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg transform -translate-y-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#121212]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="8" r="6"/>
              <circle cx="16" cy="16" r="6"/>
              <path d="M8.3 6.3 16 16"/>
            </svg>
          </button>
        </div>
        
        <button 
          className="flex flex-col items-center justify-center p-2 text-gray-500"
          onClick={openReferralModal}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span className="text-xs mt-1">Mời bạn</span>
        </button>
        
        <button className="flex flex-col items-center justify-center p-2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 20a6 6 0 0 0-12 0"/>
            <circle cx="12" cy="10" r="4"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
          <span className="text-xs mt-1">Cá nhân</span>
        </button>
      </nav>
      
      <ReferralModal isOpen={isReferralModalOpen} onClose={() => setIsReferralModalOpen(false)} />
    </>
  );
};

export default BottomNavigation;
