import { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

/**
 * Hook untuk membaca photoURL real-time dari database
 * Selalu baca dari path users/{uid}/photoURL untuk mendapatkan photo terbaru
 * Fallback ke parameter userPhotoAuth jika tidak ada di database
 */
export const useUserPhoto = (userId, userPhotoAuth) => {
  const fallbackPhoto = userPhotoAuth || '';
  const [photoURL, setPhotoURL] = useState(fallbackPhoto);

  useEffect(() => {
    // Jika userId tidak ada, jangan setup listener
    if (!userId) {
      return;
    }

    // Listen to real-time updates dari database path users/{uid}/photoURL
    const photoRef = ref(database, `users/${userId}/photoURL`);

    const unsubscribe = onValue(
      photoRef,
      (snapshot) => {
        const dbPhoto = snapshot.val();
        if (dbPhoto) {
          // Jika ada foto di database (prioritas utama), gunakan itu
          console.log(`Photo updated for user ${userId}`);
          setPhotoURL(dbPhoto);
        } else {
          // Jika tidak ada di database, fallback ke Firebase Auth photo
          setPhotoURL(fallbackPhoto);
        }
      },
      (error) => {
        console.warn('Error reading photo from database:', error.code, error.message);
        // Tetap gunakan fallback
        setPhotoURL(fallbackPhoto);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId, fallbackPhoto]);

  return userId ? photoURL : fallbackPhoto;
};
