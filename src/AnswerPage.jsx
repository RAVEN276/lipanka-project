import React from 'react';
import GlassCard from './components/GlassCard/GlassCard'
import './AnswerPage.css';

// Import Assets
import pageBg from './assets/page-background.svg';
import bandung from './assets/Bandung.svg';

const AnswerPage = ({ onBack }) => {
  const dataJawaban = [
    { id: 1, kota: "KOTA BANDUNG", isCorrect: true, img: bandung },
    { id: 2, kota: "KOTA BANDUNG", isCorrect: true, img: bandung },
    { id: 3, kota: "KOTA CIMAHI", isCorrect: false, img: bandung },
    { id: 4, kota: "KOTA CIMAHI", isCorrect: false, img: bandung },
    { id: 5, kota: "KOTA BANDUNG", isCorrect: true, img: bandung }, // Jawaban ke-5
  ];

  return (
    <div className="answer-page-container" style={{ backgroundImage: `url(${pageBg})` }}>
      
      <div className="answer-header">
        <button className="back-arrow-btn" onClick={onBack}>←</button>
        <h1 className="answer-title-text">Tampilkan Jawaban</h1>
      </div>

      <div className="answer-list-wrapper">
        {dataJawaban.map((item) => (
          <GlassCard key={item.id} className="glass-card-answer-item">
            <span className="item-number">{item.id}</span>

            <div className="item-thumb-container">
              <img src={item.img} alt={`Soal ${item.id}`} />
            </div>

            <div className="city-label-badge">
              <span className="city-name-text">{item.kota}</span>
            </div>

            <div className="status-icon-container">
              {item.isCorrect ? (
                <span className="status-icon check">✓</span>
              ) : (
                <span className="status-icon cross">✕</span>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default AnswerPage;