// ============================================================
//  FIREBASE CONFIGURATION — replace the placeholder values
//  below with your own config from the Firebase Console.
//
//  How to get your config:
//  1. Go to https://console.firebase.google.com
//  2. Select your project (or create one)
//  3. Click the gear icon ⚙️ → Project settings
//  4. Under "Your apps", click the web app (</>)
//  5. Copy the firebaseConfig object and paste it here
//
//  ALSO enable Google Sign-In:
//  Firebase Console → Authentication → Sign-in method → Google → Enable
// ============================================================

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// ▼▼▼ PASTE YOUR FIREBASE CONFIG HERE ▼▼▼
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
// ▲▲▲ END OF CONFIG ▲▲▲

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
