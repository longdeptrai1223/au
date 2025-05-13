import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getInitials } from '../lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

const Header = () => {
  const { user, userData, signOut } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  return (
    <>
      <header className="bg-[#1E1E1E] shadow-md px-4 py-3 flex items-center justify-between z-30">
        <div className="flex items-center">
          <div className="flex items-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <rect width="32" height="32" rx="16" fill="#FF3B30"/>
              <circle cx="16" cy="16" r="12" stroke="#FFD700" strokeWidth="1.5"/>
              <path d="M12.395 20.25H10.798L14.68 11.75H16.336L20.218 20.25H18.621L15.546 13.416L12.395 20.25ZM12.828 16.95L18.264 16.95L18.264 18.23L12.828 18.23L12.828 16.95Z" fill="#FFD700"/>
            </svg>
            <h1 className="text-xl font-bold">AuMiner</h1>
          </div>
        </div>
        <div className="flex items-center">
          <button 
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-[#2C2C2C]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
          <div className="ml-3 relative">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
              {userData?.photoURL ? (
                <img src={userData.photoURL} alt="Avatar" className="h-8 w-8 rounded-full" />
              ) : (
                <span>{getInitials(userData?.displayName)}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Đăng xuất</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi AuMiner không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={signOut}>Đăng xuất</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Header;
