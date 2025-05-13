import { useAuth } from '../contexts/AuthContext';
import { formatAuBalance } from '../lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

const WalletCard = () => {
  const { userData } = useAuth();
  const [showHistory, setShowHistory] = useState(false);

  const balance = userData?.balance || 0;
  // This would come from actual data in a real app
  const todayEarnings = "+0.1 hôm nay";

  return (
    <>
      <div className="bg-[#1E1E1E] rounded-xl shadow-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Ví của tôi</h2>
          <div className="bg-[#2C2C2C] rounded-full p-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FFD700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-bold text-white mr-2">{formatAuBalance(balance)}</span>
          <span className="text-xl text-[#FFD700] font-medium">Au</span>
        </div>
        
        <div className="flex items-center mb-4 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#4CD4C8] mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 7 10 10" />
            <path d="M17 7v10H7" />
          </svg>
          <span className="text-[#4CD4C8]">{todayEarnings}</span>
        </div>
        
        <div className="flex space-x-4">
          <button className="flex-1 bg-gradient-to-r from-[#4CD4C8] to-[#4CD4C8]/70 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center transition hover:opacity-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
            Rút
          </button>
          <button 
            className="flex-1 bg-[#2C2C2C] text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center transition hover:bg-opacity-80"
            onClick={() => setShowHistory(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
              <path d="M12 7v5l2.5 2.5" />
            </svg>
            Lịch sử
          </button>
        </div>
      </div>
      
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lịch sử giao dịch</DialogTitle>
            <DialogDescription>
              Xem chi tiết lịch sử giao dịch của bạn.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <p className="text-center text-gray-400">
              Tính năng này sẽ được cập nhật trong phiên bản tới.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletCard;
