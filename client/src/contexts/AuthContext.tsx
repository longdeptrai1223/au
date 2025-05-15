// client/src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth, onAuthStateChanged, getUserData, createUserProfile, checkReferralCode, addReferral, signInWithGoogle, signOut as firebaseSignOut } from '../lib/firebase';
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
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      console.log('Auth state changed:', authUser ? 'User logged in' : 'No user');
      try {
        if (authUser) {
          // Lấy token
          const token = await authUser.getIdToken();
          console.log('Token obtained successfully');
          
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
          
          if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
          }
          
          console.log('Token set on server successfully');
          
          // Set user state
          setUser(authUser);
          
          // Lấy và set user profile
          try {
            const profile = await createUserProfile(authUser);
            setUserData(profile);
            console.log('User profile loaded successfully');
          } catch (profileError) {
            console.error('Error loading user profile:', profileError);
            toast({
              title: "Error",
              description: "Could not load user profile",
              variant: "destructive",
            });
          }
        } else {
          console.log('No user found, clearing states');
          setUser(null);
          setUserData(null);
          localStorage.removeItem('firebaseToken');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setUser(null);
        setUserData(null);
        localStorage.removeItem('firebaseToken');
        toast({
          title: "Authentication Error",
          description: "There was a problem with authentication",
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