import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe; // Cleanup listener on unmount
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      // Ignore user-cancelled popup errors
      if (!msg.includes('popup-closed-by-user') && !msg.includes('cancelled-popup-request')) {
        setError('Login failed. Please try again.');
      }
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch {
      setError('Logout failed. Please try again.');
    }
  };

  return { user, loading, error, signInWithGoogle, logout };
}
