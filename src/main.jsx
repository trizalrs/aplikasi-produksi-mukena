// src/main.jsx

import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// <-- BARU: Impor provider dari pustaka Google -->
import { GoogleOAuthProvider } from '@react-oauth/google';

// <-- BARU: Ambil Client ID dari file .env -->
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* -- BARU: Bungkus App dengan GoogleOAuthProvider -- */}
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)