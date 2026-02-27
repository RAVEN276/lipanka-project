import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBackground from '../Components/PageBackground/PageBackground';
import { database, auth } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { useUserPhoto } from '../hooks/useUserPhoto';
import { useUserName } from '../hooks/useUserName';
import pialaIcon from '../assets/Piala.svg';
import './Leaderboard.css';

// Component untuk Top Player dengan live photo
const TopPlayerCard = ({ player, rank }) => {
  const livePhoto = useUserPhoto(player?.uid, player?.photoURL);
  const liveName = useUserName(player?.uid, player?.name);
  const getAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;

  if (!player) return <div className={`top-player rank-${rank}`} style={{ opacity: 0 }}></div>;

  let rankClass = '';
  if (rank === 1) rankClass = 'gold';
  else if (rank === 2) rankClass = 'silver';
  else if (rank === 3) rankClass = 'bronze';

  const displayName = liveName || player?.name || 'Player';

  return (
    <div className={`top-player rank-${rank}`}>
      {rank === 1 && <div className="crown-icon">👑</div>}
      <div className={`avatar-wrapper ${rankClass}`}>
        <img 
          src={livePhoto || player.photoURL || getAvatar(displayName)} 
          alt={displayName} 
          className="avatar"
          referrerPolicy="no-referrer"
          onError={(e) => { e.target.onerror = null; e.target.src = getAvatar(displayName); }}
        />
        <div className={`rank-badge ${rankClass}`}>
          {rank}
        </div>
      </div>
      <div className={`player-card ${rank === 1 ? 'highlight' : ''}`}>
        <div className="player-name">{displayName}</div>
        <div className="player-score">{player.score}</div>
      </div>
    </div>
  );
};

// Component untuk Runner Up dengan live photo
const RunnerUpPlayer = ({ player, index }) => {
  const livePhoto = useUserPhoto(player?.uid, player?.photoURL);
  const liveName = useUserName(player?.uid, player?.name);
  const getAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;

  const displayName = liveName || player?.name || 'Player';

  return (
    <div className="runner-up-item">
      <div className="rank-number">{index + 4}</div>
      <img 
        src={livePhoto || player.photoURL || getAvatar(displayName)} 
        alt={displayName} 
        className="mini-avatar"
        referrerPolicy="no-referrer"
        onError={(e) => { e.target.onerror = null; e.target.src = getAvatar(displayName); }}
      />
      <div className="runner-info">
        <span className="runner-name">{displayName}</span>
        <span className="runner-score">{player.score} Pts</span>
      </div>
    </div>
  );
};

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

  return (
    <PageBackground>
      {/* Top Bar - Header for Profile/Leaderboard icons */}
      <div className="leaderboard-topbar">
        {/* Back Button */}
        <div 
          className="leaderboard-back-button" 
          onClick={() => navigate(-1)}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
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
              <TopPlayerCard player={topPlayers[1]} rank={2} />
              <TopPlayerCard player={topPlayers[0]} rank={1} />
              <TopPlayerCard player={topPlayers[2]} rank={3} />
            </div>

            {/* Runners Up List */}
            {runnersUp.length > 0 && (
              <div className="runners-up-container">
                <div className="runners-up-list">
                  {runnersUp.map((player, index) => (
                    <RunnerUpPlayer key={player.uid} player={player} index={index} />
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
