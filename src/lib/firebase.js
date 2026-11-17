import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { isFirebaseConfigComplete } from './authHelpers.js';

const env = import.meta.env ?? {};

const firebaseConfig = {
  apiKey: env.PUBLIC_FIREBASE_API_KEY,
  authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.PUBLIC_FIREBASE_APP_ID,
};

let cachedAuth = null;

/**
 * Returns whether the required Firebase environment variables are configured.
 *
 * @returns {boolean}
 */
export function isFirebaseConfigured() {
  return isFirebaseConfigComplete(firebaseConfig);
}

/**
 * Lazily initializes Firebase in the browser only and returns the Auth instance,
 * or null during SSR / when environment credentials are not configured.
 *
 * @returns {import('firebase/auth').Auth | null}
 */
export function getFirebaseAuth() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!isFirebaseConfigured()) {
    return null;
  }

  if (cachedAuth) {
    return cachedAuth;
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    cachedAuth = getAuth(app);
    return cachedAuth;
  } catch {
    return null;
  }
}

/**
 * Creates a configured Google Auth provider prompting account selection.
 *
 * @returns {GoogleAuthProvider}
 */
export function createGoogleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
}
