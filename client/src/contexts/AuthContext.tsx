// VietnamGreeter/client/src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth, onAuthStateChanged, getUserData, createUserProfile, checkReferralCode, addReferral, signInWithGoogle, signOut as firebaseSignOut, getRedirectResult } from '../lib/firebase';
import { useToast } from '../hooks/use-toast';

interface AuthContextProps {
  user: User | null;
  userData: any | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  userData: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isSubscribed = true;

    const handleAuth = async (authUser: User | null) => {
      try {
        if (authUser) {
          const token = await authUser.getIdToken(true);
          
          // Gửi token lên server
          const response = await fetch('/api/set-token', {
            method: 'POST',
            credentials: 'include',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
          });

          if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
          }

          // Lưu token vào localStorage sau khi server xác nhận
          localStorage.setItem('firebaseToken', token);
          
          if (isSubscribed) {
            setUser(authUser);
            const profile = await createUserProfile(authUser);
            setUserData(profile);
          }
        } else {
          if (isSubscribed) {
            setUser(null);
            setUserData(null);
            localStorage.removeItem('firebaseToken');
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
        if (isSubscribed) {
          setUser(null);
          setUserData(null);
          localStorage.removeItem('firebaseToken');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    // Xử lý kết quả redirect khi load trang
    const handleInitialAuth = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log('Got redirect result:', result.user.email);
          await handleAuth(result.user);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Redirect result error:', error);
        setLoading(false);
      }
    };

    handleInitialAuth();

    // Theo dõi thay đổi trạng thái auth
    const unsubscribe = onAuthStateChanged(auth, handleAuth);

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, [toast]);

  const signIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign In Failed",
        description: "There was a problem signing in with Google.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut();
      localStorage.removeItem('firebaseToken');
      // Xóa cookie khi đăng xuất
      document.cookie = 'firebaseToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign Out Failed",
        description: "There was a problem signing out.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};