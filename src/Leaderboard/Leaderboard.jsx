import React, { useState, useEffect } from 'react';
import './Leaderboard.css';
import pageBackground from '../assets/page-background.svg';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setData(parsedData);
      } else {
        setData([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper untuk avatar default jika kosong
  const getAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;

  // Pisahkan Top 3 dan Runners Up
  // Format Top 3 agar sesuai urutan tampilan CSS yang ada: Rank 2 (Kiri), Rank 1 (Tengah), Rank 3 (Kanan)
  // Data sudah terurut berdasarkan skor (Index 0 = Rank 1, Index 1 = Rank 2, Index 2 = Rank 3)
  
  const rank1 = data[0];
  const rank2 = data[1];
  const rank3 = data[2];

  const topThree = [];
  if (rank2) topThree.push({ ...rank2, rank: 2, color: '#99ACAE' }); // Silver
  if (rank1) topThree.push({ ...rank1, rank: 1, color: '#E1A414' }); // Gold
  if (rank3) topThree.push({ ...rank3, rank: 3, color: '#A0613C' }); // Bronze

  const runnersUp = data.slice(3).map((player, index) => ({
    ...player,
    rank: index + 4
  }));

  return (
    <div className="leaderboard-container">
      {/* Background Image specific for Leaderboard */}
      <img src={pageBackground} alt="Page Background" className="leaderboard-bg" />
      
      <h1 className="leaderboard-title">LEADERBOARD (HARI INI)</h1>

      {loading ? (
        <div style={{ color: 'white', textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>Loading...</div>
      ) : data.length === 0 ? (
        <div style={{ color: 'white', textAlign: 'center', marginTop: '50px', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Belum ada skor hari ini. Jadilah yang pertama!
        </div>
      ) : (
        <>
          <div className="top-three">
            {topThree.map((player) => (
              <div key={player.uid || player.rank} className={`top-player rank-${player.rank}`}>
                <div className="avatar-wrapper" style={{ borderColor: player.color }}>
                  <img 
                    src={player.photoURL || getAvatar(player.name)} 
                    alt={player.name} 
                    className="avatar"
                    onError={(e) => { e.target.onerror = null; e.target.src = getAvatar(player.name); }}
                  />
                  <div className="rank-badge" style={{ backgroundColor: player.color }}>
                    {player.rank}
                  </div>
                </div>
                <div className="player-info">
                  <h3 className="player-name">{player.name}</h3>
                  <p className="player-score">{player.score}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="runners-up-list">
            {runnersUp.map((player) => (
              <div key={player.uid || player.rank} className="list-item">
                <div className="list-left">
                  <span className="list-rank">{player.rank}</span>
                  <img 
                    src={player.photoURL || getAvatar(player.name)} 
                    alt={player.name} 
                    className="list-avatar" 
                    onError={(e) => { e.target.onerror = null; e.target.src = getAvatar(player.name); }}
                  />
                  <span className="list-name">{player.name}</span>
                </div>
                <span className="list-score">{player.score}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
