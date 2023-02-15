import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeApp } from 'firebase/app';

const REACT_APP_FIREBASE_APP_ID = process.env.REACT_APP_FIREBASE_APP_ID
const REACT_APP_FIREBASE_API_KEY = process.env.REACT_APP_FIREBASE_API_KEY
const REACT_APP_FIREBASE_DATABASE_URL = process.env.REACT_APP_FIREBASE_DATABASE_URL

const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: "padawans107-frontend-shop.firebaseapp.com",
  projectId: "padawans107-frontend-shop",
  storageBucket: "padawans107-frontend-shop.appspot.com",
  messagingSenderId: "20721830109",
  appId: REACT_APP_FIREBASE_APP_ID,
  databaseURL: REACT_APP_FIREBASE_DATABASE_URL
};

initializeApp(firebaseConfig)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
