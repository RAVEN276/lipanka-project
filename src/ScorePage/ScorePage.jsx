import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GlassCard from '../Components/GlassCard/GlassCard'; 
import './ScorePage.css';
import heroBg from '../assets/hero-background.svg';
import confetti from 'canvas-confetti'; 
import { auth, database } from '../firebase';
import { ref, runTransaction, set } from 'firebase/database'; // Tambahkan set

const ScorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasSavedScore = useRef(false);

  // Menangkap data dari GamePage
  const finalScore = location.state?.finalScore || 0;
  const gameHistory = location.state?.history || [];
  const theme = location.state?.theme || 'daerah';
  const isScoreSaved = location.state?.scoreSaved || false; // Cek flag scoreSaved

  // Efek Confetti & Animasi 
  useEffect(() => {
    // Play fireworks sound
    const audio = new Audio('/audio/fireworks.mp3');
    audio.volume = 0.6; 
    audio.play().catch(e => console.log("Audio play failed", e));

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2d3e33', '#4ade80', '#ffffff']
    });

    const end = Date.now() + 3000;
    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4ade80'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#2d3e33'],
      });
  
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Simpan skor ke Firebase Leaderboard
  useEffect(() => {
    const saveScoreToLeaderboard = async () => {
      // 1. Cek apakah user login
      if (!auth.currentUser) return;

      // 2. Cek apakah skor 0 (opsional) atau sudah pernah disimpan sebelumnya
      // Jika isScoreSaved bernilai true, berarti kita sudah memproses skor ini
      if (isScoreSaved) {
        console.log("Score already saved for this session, skipping.");
        return;
      }
      
      // Mencegah penyimpanan berulang di sesi aktif komponen (ref guard)
      if (hasSavedScore.current) return;
      hasSavedScore.current = true;

      const user = auth.currentUser;
      const today = new Date().toISOString().split('T')[0]; 
      const userId = user.uid;
      const userScoreRef = ref(database, `leaderboard/${today}/${userId}`);

      // Dapatkan data terbaru dari Auth (jika ada update di EditProfile)
      // Namun hati-hati, auth.currentUser mungkin belum ter-refresh 
      // jika tidak direload, tapi biasanya sudah cukup sinkron.
      // Lebih aman lagi baca dari database `users/{uid}` juga, tapi
      // auth.currentUser properti statisnya sudah diupdate di EditProfile.

      try {
        await runTransaction(userScoreRef, (currentData) => {
          let currentPhoto = user.photoURL || '';
          let currentName = user.displayName || 'Anonymous';

          // Jika user belum pernah set foto di Edit Profil (photoURL Auth masih googleusercontent),
          // pastikan kita simpan URL tersebut ke database users/{uid}/photoURL juga 
          // agar useUserPhoto bisa membacanya nanti.
          // (Tapi runTransaction harus murni, jadi side effect ke users/{uid} sebaiknya di luar)
          
          if (currentData === null) {
            return {
              name: currentName,
              photoURL: currentPhoto,
              score: finalScore,
              timestamp: Date.now()
            };
          } else {
            // Update skor DAN data profil (nama/foto) agar selalu fresh
            // Prioritaskan photo terbaru dari Auth, jika Auth kosong baru pakai data lama
            return {
              ...currentData,
              name: currentName || currentData.name, 
              photoURL: currentPhoto || currentData.photoURL,     // Update foto
              score: (currentData.score || 0) + finalScore,
              timestamp: Date.now()
            };
          }
        });
        
        // --- TAMBAHAN PENTING ---
        // Jika user belum ada data di users/{uid}/photoURL (misal baru login Google),
        // kita simpan foto Google Auth-nya ke database users node juga.
        // Ini supaya hook useUserPhoto bisa membacanya tanpa perlu user ke Edit Profil dulu.
        if (user.photoURL) {
            const userPhotoRef = ref(database, `users/${user.uid}/photoURL`);
            // Set update, tapi kita gunakan update() atau set() di luar transaction agar tidak blocking
            // Kita pakai update ke root users node jika perlu, tapi set ke specific path lebih aman
            // Cek dulu apakah sudah ada? Atau timpa saja karena ini foto terbaru dari Auth
            // Kita gunakan set saja agar pasti tersimpan.
            set(userPhotoRef, user.photoURL).catch(err => console.log("Auto-save photo failed", err));
            
            // Simpan nama juga
            const userNameRef = ref(database, `users/${user.uid}/displayName`);
            if (user.displayName) {
                set(userNameRef, user.displayName).catch(err => console.log("Auto-save name failed", err));
            }
        }
        
        console.log(`Score updated! Added ${finalScore} to previous score.`);

        // 3. TANDAI BAHWA SKOR SUDAH DISIMPAN
        // Kita replace state history saat ini dengan menambahkan flag scoreSaved: true
        // Ini tidak akan me-refresh halaman, tapi mengubah state di history browser
        navigate(location.pathname, { 
          replace: true, 
          state: { 
            ...location.state, 
            scoreSaved: true 
          } 
        });

      } catch (error) {
        console.error("Error updating leaderboard:", error);
      }
    };

    saveScoreToLeaderboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalScore, isScoreSaved]); // Tambahkan dependency isScoreSaved

  return (
    <div className="score-page-container" style={{ backgroundImage: `url(${heroBg})` }}>
      {/* Back Button */}
      <div 
        className="score-back-button" 
        onClick={() => navigate(`/theme/${theme}`)}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <div className="score-overlay">
        <GlassCard className="score-main-card">
          <h1 className="score-status-title">PERMAINAN SELESAI</h1>
          
          <div className="score-divider"></div>

          <div className="score-display-section">
            <p className="score-label">Score</p>
            <h2 className="score-value">{finalScore}</h2>
          </div>

          <div className="score-divider"></div>

          <div className="score-menu-buttons">
            {/* 1. Tombol Leaderboard */}
            <button 
              className="score-menu-item"
              onClick={() => navigate('/leaderboard')} 
            >
              Leaderboard
            </button>
            
            {/* 2. Tombol Tampilkan Jawaban - Mengirim data history asli */}
            <button 
              className="score-menu-item" 
              onClick={() => navigate('/answer', { state: { results: gameHistory } })}
            >
              Tampilkan Jawaban
            </button>
            
            {/* 3. Tombol Mulai Lagi - Kembali ke pemilihan tema */}
            <button 
              className="score-menu-item" 
              onClick={() => navigate(`/game/${theme}`)}
            >
              Mulai Lagi
            </button>

             {/* 4. Tombol Home - Kembali ke HeroPage */}
             <button 
              className="score-menu-item" 
              onClick={() => navigate('/')}
            >
              Home
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ScorePage;