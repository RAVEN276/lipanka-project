import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GlassCard from '../Components/GlassCard/GlassCard'; 
import './ScorePage.css';
import heroBg from '../assets/hero-background.svg';
import { auth, database } from '../firebase';
import { ref, get, set, runTransaction } from 'firebase/database';

const ScorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasSavedScore = useRef(false);

  // Menangkap data dari GamePage
  const finalScore = location.state?.finalScore || 0;
  const gameHistory = location.state?.history || [];
  const isScoreSaved = location.state?.scoreSaved || false; // Cek flag scoreSaved

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

      try {
        await runTransaction(userScoreRef, (currentData) => {
          if (currentData === null) {
            return {
              name: user.displayName || 'Anonymous',
              photoURL: user.photoURL || '',
              score: finalScore,
              timestamp: Date.now()
            };
          } else {
            return {
              ...currentData,
              score: (currentData.score || 0) + finalScore,
              timestamp: Date.now()
            };
          }
        });
        
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