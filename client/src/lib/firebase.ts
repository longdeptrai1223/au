import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getRedirectResult,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || process.env.GOOGLE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOut = () => firebaseSignOut(auth);

// User functions
export const getUserData = async (userId: string) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() ? userDoc.data() : null;
};

export const createUserProfile = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    // Create new user profile
    const newUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      balance: 0,
      createdAt: serverTimestamp(),
      lastMiningClaim: null,
      nextMiningClaim: null,
      referralCode: generateReferralCode(10),
      referredBy: null,
      referrals: [],
      adBoostEndTime: null,
    };
    
    await setDoc(userRef, newUser);
    return newUser;
  }
  
  return userDoc.data();
};

export const updateUserBalance = async (userId: string, newBalance: number) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { balance: newBalance });
};

export const updateUserMiningClaim = async (userId: string) => {
  const now = new Date();
  const nextClaim = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { 
    lastMiningClaim: Timestamp.fromDate(now), 
    nextMiningClaim: Timestamp.fromDate(nextClaim)
  });
};

export const updateAdBoostTime = async (userId: string, hours: number) => {
  const now = new Date();
  let endTime: Date;
  
  // Get current user data to check if there's an existing boost
  const userData = await getUserData(userId);
  
  // If there's an existing boost that hasn't expired yet, add to it
  if (userData?.adBoostEndTime && userData.adBoostEndTime.toDate() > now) {
    endTime = new Date(userData.adBoostEndTime.toDate().getTime() + hours * 60 * 60 * 1000);
  } else {
    // Otherwise set new end time
    endTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
  }
  
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { 
    adBoostEndTime: Timestamp.fromDate(endTime)
  });
};

// Activity functions
export const addActivity = async (userId: string, type: string, amount: string, details: string = "") => {
  await addDoc(collection(db, "activities"), {
    userId,
    type,
    amount,
    details,
    createdAt: serverTimestamp()
  });
};

export const getUserActivities = (userId: string, callback: (activities: any[]) => void) => {
  const activitiesRef = collection(db, "activities");
  const q = query(activitiesRef, where("userId", "==", userId));
  
  return onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => b.createdAt - a.createdAt);
    
    callback(activities);
  });
};

// Referral functions
export const checkReferralCode = async (code: string) => {
  if (!code) return null;
  
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("referralCode", "==", code));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  return snapshot.docs[0].id;
};

export const addReferral = async (referrerId: string, referredId: string) => {
  const referrerRef = doc(db, "users", referrerId);
  const referrerDoc = await getDoc(referrerRef);
  
  if (referrerDoc.exists()) {
    const referrals = referrerDoc.data().referrals || [];
    
    // Check if this user is already in referrals
    if (!referrals.includes(referredId)) {
      referrals.push(referredId);
      await updateDoc(referrerRef, { referrals });
      
      // Update the referred user
      const referredRef = doc(db, "users", referredId);
      await updateDoc(referredRef, { referredBy: referrerId });
      
      // Add activity for referrer
      await addActivity(referrerId, "referral", "+10%", "Lời mời thành công");
    }
  }
};

// Helper functions
function generateReferralCode(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export { auth, db, onAuthStateChanged, getRedirectResult };