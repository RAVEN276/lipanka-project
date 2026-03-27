import { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

/**
 * Hook untuk membaca displayName real-time dari database
 * Selalu baca dari path users/{uid}/displayName agar nama terbaru terlihat
 * Fallback ke parameter fallbackName jika tidak ada di database
 */
export const useUserName = (userId, fallbackName) => {
  const fallback = fallbackName || '';
  const [displayName, setDisplayName] = useState(fallback);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const nameRef = ref(database, `users/${userId}/displayName`);

    const unsubscribe = onValue(
      nameRef,
      (snapshot) => {
        const dbName = snapshot.val();
        if (dbName) {
          setDisplayName(dbName);
        } else {
          setDisplayName(fallback);
        }
      },
      (error) => {
        console.warn('Error reading displayName from database:', error.code, error.message);
        setDisplayName(fallback);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId, fallback]);

  return userId ? displayName : fallback;
};
