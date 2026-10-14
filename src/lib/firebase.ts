import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import localConfig from '../../firebase-applet-config.json';

const env = (import.meta as any).env || {};

const firebaseConfig = {
  ...localConfig,
  apiKey: env.VITE_FIREBASE_API_KEY || (localConfig as any)?.apiKey,
  projectId: env.VITE_FIREBASE_PROJECT_ID || (localConfig as any)?.projectId,
  appId: env.VITE_FIREBASE_APP_ID || (localConfig as any)?.appId,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || (localConfig as any)?.authDomain,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || (localConfig as any)?.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || (localConfig as any)?.messagingSenderId,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);
