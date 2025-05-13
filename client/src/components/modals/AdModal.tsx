import { Dialog, DialogContent } from '../ui/dialog';
import { useMining } from '../../contexts/MiningContext';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdModal = ({ isOpen, onClose }: AdModalProps) => {
  const { watchAd } = useMining();
  
  const handleWatchAd = async () => {
    await watchAd();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E1E1E] text-white border-[#2C2C2C] text-center sm:max-w-sm">
        <div className="w-16 h-16 mx-auto mb-4">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="32" fill="#4CD4C8" fillOpacity="0.2"/>
            <path d="M21 42V22C64 71.5 41.5 21.5 43 22V42" stroke="#4CD4C8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 22L32 32L43 22" stroke="#4CD4C8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-3">Tăng hiệu suất đào</h2>
        <p className="text-gray-400 mb-6">Xem quảng cáo để nhận hiệu suất đào +200% trong 2 giờ.</p>
        
        <div className="bg-[#2C2C2C] rounded-lg p-3 mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-400">Tăng hiệu suất</span>
            <span className="text-sm text-[#4CD4C8]">+200%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Thời gian hiệu lực</span>
            <span className="text-sm text-white">2 giờ</span>
          </div>
        </div>
        
        <button 
          onClick={handleWatchAd}
          className="w-full bg-gradient-to-r from-[#4CD4C8] to-[#4CD4C8]/80 text-white font-bold py-3.5 rounded-lg mb-4 transition hover:opacity-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
            <polyline points="17 2 12 7 7 2" />
          </svg>
          XEM QUẢNG CÁO
        </button>
        
        <button 
          onClick={onClose}
          className="text-gray-400 py-2 transition hover:text-white"
        >
          Để sau
        </button>
      </DialogContent>
    </Dialog>
  );
};
