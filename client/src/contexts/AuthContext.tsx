// client/src/contexts/AuthContext.tsx
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
      console.log('Starting auth process:', { authUser: !!authUser });
      try {
        if (authUser) {
          // Lấy token
          const token = await authUser.getIdToken(true); // Force refresh token
          console.log('Token obtained:', token.substring(0, 10) + '...');
          
          // Lưu token vào localStorage
          localStorage.setItem('firebaseToken', token);
          
          // Gửi token lên server
          const response = await fetch('/api/set-token', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ token }),
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
          });
          
          console.log('Server response:', {
            status: response.status,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries())
          });

          if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
          }
          
          if (isSubscribed) {
            setUser(authUser);
            
            // Lấy và set user profile
            try {
              const profile = await createUserProfile(authUser);
              if (isSubscribed) {
                setUserData(profile);
                console.log('User profile loaded successfully:', profile);
              }
            } catch (profileError) {
              console.error('Error loading user profile:', profileError);
              toast({
                title: "Error",
                description: "Could not load user profile",
                variant: "destructive",
              });
            }
          }
        } else {
          console.log('No user found, clearing states');
          if (isSubscribed) {
            setUser(null);
            setUserData(null);
            localStorage.removeItem('firebaseToken');
          }
        }
      } catch (error) {
        console.error('Detailed auth error:', {
          error,
          message: error.message,
          stack: error.stack
        });
        if (isSubscribed) {
          setUser(null);
          setUserData(null);
          localStorage.removeItem('firebaseToken');
          toast({
            title: "Authentication Error",
            description: "There was a problem with authentication",
            variant: "destructive",
          });
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
      await firebaseSignOut();
      localStorage.removeItem('firebaseToken');
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
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};