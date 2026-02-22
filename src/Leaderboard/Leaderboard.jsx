import React from 'react';
import './Leaderboard.css';
import pageBackground from '../assets/page-background.svg';

const Leaderboard = () => {
  const topThree = [
    { 
      rank: 2, 
      name: 'Rosa Diaz', 
      score: 900, 
      color: '#99ACAE', 
      img: 'https://ui-avatars.com/api/?name=Rosa+Diaz&background=0D8ABC&color=fff' 
    },
    { 
      rank: 1, 
      name: 'Jake Peralta', 
      score: 1000, 
      color: '#E1A414', 
      img: 'https://ui-avatars.com/api/?name=Jake+Peralta&background=0D8ABC&color=fff' 
    },
    { 
      rank: 3, 
      name: 'Amy Santiago', 
      score: 850, 
      color: '#A0613C', 
      img: 'https://ui-avatars.com/api/?name=Amy+Santiago&background=0D8ABC&color=fff' 
    }
  ];

  const runnersUp = [
    { rank: 4, name: 'Raymond Holt', score: 700, img: 'https://ui-avatars.com/api/?name=Raymond+Holt&background=0D8ABC&color=fff' },
    { rank: 5, name: 'Terry Jeffords', score: 650, img: 'https://ui-avatars.com/api/?name=Terry+Jeffords&background=0D8ABC&color=fff' },
    { rank: 6, name: 'Charles Boyle', score: 300, img: 'https://ui-avatars.com/api/?name=Charles+Boyle&background=0D8ABC&color=fff' },
  ];

  return (
    <div className="leaderboard-container">
      {/* Background Image specific for Leaderboard */}
      <img src={pageBackground} alt="Page Background" className="leaderboard-bg" />
      
      <h1 className="leaderboard-title">LEADERBOARD</h1>

      <div className="top-three">
        {topThree.map((player) => (
          <div key={player.rank} className={`top-player rank-${player.rank}`}>
            <div className="avatar-wrapper" style={{ borderColor: player.color }}>
              <img src={player.img} alt={player.name} className="avatar" />
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
          <div key={player.rank} className="list-item">
            <div className="list-left">
              <span className="list-rank">{player.rank}</span>
              <img src={player.img} alt={player.name} className="list-avatar" />
              <span className="list-name">{player.name}</span>
            </div>
            <span className="list-score">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
