import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Safely probe for local config without breaking Rollup build if file is not committed
const localConfigs = (import.meta as any).glob ? (import.meta as any).glob('../../firebase-applet-config.json', { eager: true }) : {};
const localConfig = (Object.values(localConfigs)[0] as any)?.default || {};

const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || localConfig.apiKey || "AIzaSyDucr_It2iEU6rBmCOa9yZZAbi020MFJaY",
  projectId: env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId || "gen-lang-client-0153515890",
  appId: env.VITE_FIREBASE_APP_ID || localConfig.appId || "1:977532137108:web:b10ac184daae9de4044e81",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain || "gen-lang-client-0153515890.firebaseapp.com",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket || "gen-lang-client-0153515890.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId || "977532137108",
  firestoreDatabaseId: env.VITE_FIREBASE_DATABASE_ID || localConfig.firestoreDatabaseId || "(default)",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
