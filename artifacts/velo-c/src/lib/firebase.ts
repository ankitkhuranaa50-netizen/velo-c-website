import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBp7x25m8X_BwqU7JFS-tw0pRcvssPfyB8",
  authDomain: "velo-c-a0170.firebaseapp.com",
  projectId: "velo-c-a0170",
  storageBucket: "velo-c-a0170.firebasestorage.app",
  messagingSenderId: "107904414071",
  appId: "1:107904414071:web:126ca4888b090164fcb172",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
