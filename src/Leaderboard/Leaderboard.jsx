import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBackground from '../Components/PageBackground/PageBackground';
import { database, auth } from '../firebase';
import { ref, onValue } from 'firebase/database';
import pialaIcon from '../assets/Piala.svg';
import './Leaderboard.css';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    // 1. Dapatkan tanggal hari ini (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // 2. Referensi ke node leaderboard/TANGGAL
    const leaderboardRef = ref(database, `leaderboard/${today}`);

    // 3. Listen for changes
    const unsubscribe = onValue(leaderboardRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        // Convert object to array: [{ uid, ...data }, ...]
        const parsedData = Object.keys(val).map(key => ({
          uid: key,
          ...val[key]
        }));

        // Sort by score descending
        parsedData.sort((a, b) => b.score - a.score);
        setLeaderboardData(parsedData);
      } else {
        setLeaderboardData([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper untuk avatar default jika kosong
  const getAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;

  // Top 3 Players Logic
  const topPlayers = [null, null, null]; // [Rank 1, Rank 2, Rank 3] placeholder
  if (leaderboardData.length > 0) topPlayers[0] = leaderboardData[0];
  if (leaderboardData.length > 1) topPlayers[1] = leaderboardData[1];
  if (leaderboardData.length > 2) topPlayers[2] = leaderboardData[2];

  // Runners Up (Rank 4+)
  const runnersUp = leaderboardData.slice(3);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const renderTopPlayer = (player, rank) => {
    // If no player for this rank position, return empty invisible div to maintain layout spacing
    if (!player) return <div key={`empty-${rank}`} className={`top-player rank-${rank}`} style={{ opacity: 0 }}></div>;

    let rankClass = '';
    
    // Assign specific classes which control colors in CSS
    if (rank === 1) rankClass = 'gold';
    else if (rank === 2) rankClass = 'silver';
    else if (rank === 3) rankClass = 'bronze';

    return (
      <div key={player.uid} className={`top-player rank-${rank}`}>
        {rank === 1 && (
          <div className="crown-icon">👑</div>
        )}
        
        <div className={`avatar-wrapper ${rankClass}`}>
          <img 
            src={player.photoURL || getAvatar(player.name)} 
            alt={player.name} 
            className="avatar"
            onError={(e) => { e.target.onerror = null; e.target.src = getAvatar(player.name); }}
          />
          <div className={`rank-badge ${rankClass}`}>
            {rank}
          </div>
        </div>
        
        <div className={`player-card ${rank === 1 ? 'highlight' : ''}`}>
          <div className="player-name">{player.name}</div>
          <div className="player-score">{player.score}</div>
        </div>
      </div>
    );
  };

  return (
    <PageBackground>
      {/* Top Bar - Header for Profile/Leaderboard icons */}
      <div className="leaderboard-topbar">
        {/* Back Button */}
        <button 
          className="back-btn" 
          aria-label="Back" 
          onClick={() => navigate(-1)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>

      <div className="leaderboard-content">
        <h1 className="leaderboard-title">LEADERBOARD</h1>

      {loading ? (
        <div className="loading-text">Memuat Data...</div>
      ) : leaderboardData.length === 0 ? (
        <div className="empty-text">
          Belum ada skor hari ini.<br/>Jadilah yang pertama!
        </div>
      ) : (
        <>
          <div className="top-three">
             {/* Render Order for Podium: Rank 2 (Left), Rank 1 (Center), Rank 3 (Right) */}
             {renderTopPlayer(topPlayers[1], 2)}
             {renderTopPlayer(topPlayers[0], 1)}
             {renderTopPlayer(topPlayers[2], 3)}
          </div>

            {/* Runners Up List */}
            {runnersUp.length > 0 && (
              <div className="runners-up-container">
                <div className="runners-up-list">
                  {runnersUp.map((player, index) => (
                    <div key={player.uid || index} className="runner-up-item">
                      <div className="rank-number">{index + 4}</div>
                      <img 
                        src={player.photoURL || getAvatar(player.name)} 
                        alt={player.name} 
                        className="mini-avatar"
                        onError={(e) => { e.target.onerror = null; e.target.src = getAvatar(player.name); }}
                      />
                      <div className="runner-info">
                        <span className="runner-name">{player.name}</span>
                        <span className="runner-score">{player.score} Pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageBackground>
  );
};

export default Leaderboard;
