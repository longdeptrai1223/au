import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferralModal = ({ isOpen, onClose }: ReferralModalProps) => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (userData && userData.referralCode) {
      // Use current domain for the referral link
      const baseUrl = window.location.origin;
      setReferralLink(`${baseUrl}?ref=${userData.referralCode}`);
    }
  }, [userData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        toast({
          title: "Link đã được sao chép",
          description: "Link giới thiệu đã được sao chép vào clipboard.",
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Lỗi",
          description: "Không thể sao chép link. Vui lòng thử lại.",
          variant: "destructive",
        });
      });
  };

  const shareReferral = async (platform: string) => {
    try {
      switch (platform) {
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: 'Tham gia AuMiner với tôi!',
              text: 'Đào Au coin mỗi ngày và nhận thưởng. Dùng link giới thiệu của tôi để bắt đầu!',
              url: referralLink,
            });
          } else {
            copyToClipboard();
          }
          break;
        default:
          copyToClipboard();
          break;
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E1E1E] text-white border-[#2C2C2C] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Mời bạn bè</DialogTitle>
        </DialogHeader>
        
        <p className="text-gray-400 mb-6">Mời bạn bè tham gia và nhận +10% hiệu suất đào cho mỗi người dùng mới. Tối đa +200%.</p>
        
        <div className="bg-[#2C2C2C] rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-400 mb-2">Link giới thiệu của bạn:</p>
          <div className="flex items-center bg-[#121212] rounded-lg overflow-hidden">
            <div className="flex-1 px-3 py-2 overflow-hidden">
              <p className="truncate text-sm">{referralLink}</p>
            </div>
            <button 
              onClick={copyToClipboard}
              className="bg-[#FFD700] text-[#121212] px-3 py-2 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button 
            onClick={() => shareReferral('facebook')}
            className="flex flex-col items-center justify-center bg-[#2C2C2C] p-3 rounded-lg"
          >
            <svg className="h-6 w-6 text-[#1877F2] mb-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="text-xs">Facebook</span>
          </button>
          
          <button 
            onClick={() => shareReferral('twitter')}
            className="flex flex-col items-center justify-center bg-[#2C2C2C] p-3 rounded-lg"
          >
            <svg className="h-6 w-6 text-white mb-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-xs">Twitter</span>
          </button>
          
          <button 
            onClick={() => shareReferral('telegram')}
            className="flex flex-col items-center justify-center bg-[#2C2C2C] p-3 rounded-lg"
          >
            <svg className="h-6 w-6 text-[#0088cc] mb-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0Zm.16 2.315a9.67 9.67 0 0 1 6.092 17.25 9.7 9.7 0 0 1-12.326 0 9.67 9.67 0 0 1 6.233-17.25ZM6.524 14.945l1.554-.961-4.006-4.035 8.59 4.851h.001l2.638-8.958L6.524 14.945Z" />
            </svg>
            <span className="text-xs">Telegram</span>
          </button>
        </div>
        
        <button 
          onClick={() => shareReferral('native')}
          className="w-full bg-[#4CD4C8] hover:bg-[#4CD4C8]/90 text-white font-medium py-3 rounded-lg transition flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Chia sẻ liên kết
        </button>
      </DialogContent>
    </Dialog>
  );
};
