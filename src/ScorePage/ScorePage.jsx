import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard/GlassCard'; 
import './ScorePage.css';
import heroBg from '../assets/hero-background.svg';

const ScorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Menangkap data dari GamePage
  const finalScore = location.state?.finalScore || 0;
  const gameHistory = location.state?.history || [];

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