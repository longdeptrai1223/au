import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { 
  auth, 
  onAuthStateChanged, 
  getUserData, 
  createUserProfile,
  checkReferralCode, 
  addReferral 
} from '../lib/firebase';
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
    // Check for referral code in URL
    const checkForReferral = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const referralCode = urlParams.get('ref');
      
      if (referralCode) {
        // Store the referral code in localStorage to use after authentication
        localStorage.setItem('referralCode', referralCode);
        
        // Remove the referral parameter from URL to keep it clean
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    };
    
    checkForReferral();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        if (authUser) {
          setUser(authUser);
          
          // Create or get user profile
          const profile = await createUserProfile(authUser);
          setUserData(profile);
          
          // Check if there's a stored referral code
          const storedReferralCode = localStorage.getItem('referralCode');
          if (storedReferralCode && !profile.referredBy) {
            const referrerId = await checkReferralCode(storedReferralCode);
            if (referrerId && referrerId !== authUser.uid) {
              await addReferral(referrerId, authUser.uid);
              toast({
                title: "Referral Applied",
                description: "You've joined through a referral link!",
              });
              // Clear the stored referral code
              localStorage.removeItem('referralCode');
            }
          }
        } else {
          setUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.error("Auth error:", error);
        toast({
          title: "Authentication Error",
          description: "There was a problem with authentication.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [toast]);

  const signIn = async () => {
    try {
      // Implemented in App.tsx using Firebase redirect
      const { signInWithGoogle } = await import('../lib/firebase');
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign In Failed",
        description: "There was a problem signing in with Google.",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      const { signOut: firebaseSignOut } = await import('../lib/firebase');
      await firebaseSignOut();
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
