import * as admin from 'firebase-admin';
import { initializeApp, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: any;

/**
 * Initialize the Firebase Admin SDK
 * This is used for server-side verification of Firebase Auth tokens
 * and for server-side Firestore operations
 */
export function initFirebaseAdmin() {
  try {
    // Try to get the existing app if it's already initialized
    app = getApp();
  } catch (e) {
    // If no app exists, initialize one
    
    // Check if running on a platform with environment variables for service account
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Initialize with service account JSON from environment variable
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        app = initializeApp({
          credential: cert(serviceAccount),
          projectId: process.env.VITE_FIREBASE_PROJECT_ID || serviceAccount.project_id,
        });
      } catch (error) {
        console.error("Error parsing service account JSON:", error);
        throw error;
      }
    } else {
      // Initialize with application default credentials for development
      app = initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      });
    }
  }
  
  return app;
}

// Initialize the Firebase Admin SDK
initFirebaseAdmin();

// Export auth and firestore for easy access
export const auth = getAuth();
export const firestore = getFirestore();

/**
 * Verify a Firebase ID token
 * @param token Firebase ID token to verify
 * @returns Decoded token if valid
 */
export async function verifyIdToken(token: string) {
  // Make sure Firebase is initialized
  if (!app) {
    initFirebaseAdmin();
  }
  
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    throw error;
  }
}

/**
 * Get a user document from Firestore
 * @param uid User ID to retrieve
 * @returns User document or null if not found
 */
export async function getUserDocument(uid: string) {
  // Make sure Firebase is initialized
  if (!app) {
    initFirebaseAdmin();
  }
  
  try {
    const userDoc = await firestore.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return null;
    }
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error("Error getting user document:", error);
    throw error;
  }
}

/**
 * Update a user document in Firestore
 * @param uid User ID to update
 * @param data Data to update
 * @returns Updated user document
 */
export async function updateUserDocument(uid: string, data: any) {
  // Make sure Firebase is initialized
  if (!app) {
    initFirebaseAdmin();
  }
  
  try {
    await firestore.collection('users').doc(uid).update(data);
    return getUserDocument(uid);
  } catch (error) {
    console.error("Error updating user document:", error);
    throw error;
  }
}
