import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GlassCard from '../Components/GlassCard/GlassCard'; 
import './ScorePage.css';
import heroBg from '../assets/hero-background.svg';
import { auth, database } from '../firebase';
import { ref, get, set } from 'firebase/database';

const ScorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Menangkap data dari GamePage
  const finalScore = location.state?.finalScore || 0;
  const gameHistory = location.state?.history || [];

  // Simpan skor ke Firebase Leaderboard
  useEffect(() => {
    const saveScoreToLeaderboard = async () => {
      // Pastikan user login dan skor valid (bisa 0, tapi user harus login)
      if (!auth.currentUser) return;

      const user = auth.currentUser;
      // Format tanggal YYYY-MM-DD untuk reset harian
      const today = new Date().toISOString().split('T')[0]; 
      const userId = user.uid;
      
      // Referensi ke path leaderboard/TANGGAL/USER_ID
      const userScoreRef = ref(database, `leaderboard/${today}/${userId}`);

      try {
        // Cek skor yang sudah ada
        const snapshot = await get(userScoreRef);
        const currentData = snapshot.val();

        // Jika belum ada data atau skor baru lebih tinggi, update
        if (!currentData || finalScore > currentData.score) {
          await set(userScoreRef, {
            name: user.displayName || 'Anonymous',
            photoURL: user.photoURL || '',
            score: finalScore,
            timestamp: Date.now()
          });
          console.log("Score updated in Leaderboard");
        } else {
          console.log("Current score is not higher than existing record");
        }
      } catch (error) {
        console.error("Error updating leaderboard:", error);
      }
    };

    saveScoreToLeaderboard();
  }, [finalScore]);

  return (
    <div className="score-page-container" style={{ backgroundImage: `url(${heroBg})` }}>
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
              onClick={() => navigate(`/game/${location.state?.theme || 'daerah'}`)}
            >
              Mulai Lagi
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ScorePage;