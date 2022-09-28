import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import App from './App';

const {
  VITE_apiKey,
  VITE_authDomain,
  VITE_databaseURL,
  VITE_projectId,
  VITE_storageBucket,
  VITE_messagingSenderId,
  VITE_appId,
  VITE_measurementId,
} = import.meta.env;

const firebaseConfig = {
  apiKey: VITE_apiKey,
  authDomain: VITE_authDomain,
  databaseURL: VITE_databaseURL,
  projectId: VITE_projectId,
  storageBucket: VITE_storageBucket,
  messagingSenderId: VITE_messagingSenderId,
  appId: VITE_appId,
  measurementId: VITE_measurementId,
};

initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
