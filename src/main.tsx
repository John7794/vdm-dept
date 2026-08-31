import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import { CmsProvider } from './contexts/CmsContext';
import './index.css';

const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || "977532137108-s23aptslqob0f4af9l908vvam00j025r.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <CmsProvider>
        <App />
      </CmsProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
