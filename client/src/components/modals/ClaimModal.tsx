import { Dialog, DialogContent } from '../ui/dialog';
import { useMining } from '../../contexts/MiningContext';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => Promise<void>;
  reward: number;
}

export const ClaimModal = ({ isOpen, onClose, onClaim, reward }: ClaimModalProps) => {
  const { watchAd } = useMining();
  
  const handleWatchAd = async () => {
    await watchAd();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E1E1E] text-white border-[#2C2C2C] text-center sm:max-w-sm">
        <div className="w-20 h-20 mx-auto mb-4">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin-slow">
            <circle cx="40" cy="40" r="40" fill="#FFD700" fillOpacity="0.2"/>
            <circle cx="40" cy="40" r="32" fill="#FFD700"/>
            <path d="M33.043 54H28.295L40.191 28H45.158L57.054 54H52.306L42.814 32.748L33.043 54ZM34.386 43.352L51.242 43.352L51.242 47.438L34.386 47.438L34.386 43.352Z" fill="white"/>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Xin chúc mừng!</h2>
        <p className="text-gray-400 mb-6">Bạn đã hoàn thành chu kỳ đào và nhận được:</p>
        
        <div className="text-4xl font-bold text-[#FFD700] mb-8">+{reward} Au</div>
        
        <button 
          onClick={onClaim}
          className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFD700]/80 text-[#121212] font-bold py-3.5 rounded-lg mb-4 transition hover:opacity-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
          </svg>
          NHẬN THƯỞNG
        </button>
        
        <button 
          onClick={handleWatchAd}
          className="w-full bg-[#2C2C2C] text-white py-3 rounded-lg transition hover:bg-opacity-80"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
            <polyline points="17 2 12 7 7 2" />
          </svg>
          Xem quảng cáo để nhận +200% boost
        </button>
      </DialogContent>
    </Dialog>
  );
};
